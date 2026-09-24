import React, { useState, useEffect } from 'react';
import { 
  FolderGit2, RefreshCw, CheckCircle2, AlertCircle, ExternalLink, 
  Key, ShieldCheck, Star, GitFork, Clock, Code, X, Sparkles, 
  Check, Lock, Globe, UserCheck, LogOut, ArrowRight
} from 'lucide-react';
import { useAdaptiveTheme } from '../../context/ThemeContext';

export interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  html_url?: string;
  public_repos?: number;
}

interface GitHubSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRepo: string;
  onSyncRepoData: (liveRepoData: any) => void;
  currentLiveRepo: any | null;
}

export const GitHubSyncModal: React.FC<GitHubSyncModalProps> = ({
  isOpen,
  onClose,
  selectedRepo,
  onSyncRepoData,
  currentLiveRepo,
}) => {
  const { currentTheme } = useAdaptiveTheme();

  const [authToken, setAuthToken] = useState<string>(() => localStorage.getItem('apex_gh_token') || '');
  const [authUser, setAuthUser] = useState<GitHubUser | null>(() => {
    const cached = localStorage.getItem('apex_gh_user');
    return cached ? JSON.parse(cached) : null;
  });

  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [syncSuccessMessage, setSyncSuccessMessage] = useState<string | null>(null);
  const [customRepoInput, setCustomRepoInput] = useState(selectedRepo);
  const [patInput, setPatInput] = useState('');
  const [showPatInput, setShowPatInput] = useState(false);
  const [rateLimitInfo, setRateLimitInfo] = useState<{ limit: number; remaining: number } | null>(null);

  // Sync state with selectedRepo prop
  useEffect(() => {
    setCustomRepoInput(selectedRepo);
  }, [selectedRepo]);

  // Check user status & rate limit
  const checkStatus = async (token?: string) => {
    try {
      const activeToken = token !== undefined ? token : authToken;
      const headers: Record<string, string> = {};
      if (activeToken && !activeToken.startsWith('mock_auth')) {
        headers['Authorization'] = `Bearer ${activeToken}`;
      }
      const res = await fetch('/api/github/user-status', { headers });
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setAuthUser(data.user);
          localStorage.setItem('apex_gh_user', JSON.stringify(data.user));
        } else if (data.invalidToken) {
          // Bad credentials: clear stale token
          setAuthToken('');
          setAuthUser(null);
          localStorage.removeItem('apex_gh_token');
          localStorage.removeItem('apex_gh_user');
        }
        if (data.rateLimit) {
          setRateLimitInfo(data.rateLimit);
        }
      }
    } catch (e) {
      console.warn('Status check failed', e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      checkStatus();
    }
  }, [isOpen]);

  // Listen for OAuth message from callback popup
  useEffect(() => {
    const handleOAuthMessage = (event: MessageEvent) => {
      // Validate origin for AI Studio preview or localhost
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost')) {
        return;
      }

      if (event.data?.type === 'GITHUB_AUTH_SUCCESS') {
        const { token, user } = event.data;
        if (token) {
          setAuthToken(token);
          localStorage.setItem('apex_gh_token', token);
        }
        if (user) {
          setAuthUser(user);
          localStorage.setItem('apex_gh_user', JSON.stringify(user));
        }
        setIsAuthenticating(false);
        setSyncSuccessMessage(`Authenticated with GitHub as @${user?.login || 'developer'}`);
        // Auto trigger sync
        handleTriggerSync(token);
      } else if (event.data?.type === 'GITHUB_AUTH_ERROR') {
        setIsAuthenticating(false);
        setSyncError(event.data?.error || 'GitHub OAuth failed');
      }
    };

    window.addEventListener('message', handleOAuthMessage);
    return () => window.removeEventListener('message', handleOAuthMessage);
  }, [customRepoInput]);

  // Initiate OAuth Popup
  const handleConnectOAuth = async () => {
    setIsAuthenticating(true);
    setSyncError(null);
    try {
      const res = await fetch('/api/github/auth-url');
      const data = await res.json();
      if (data.url) {
        const authWindow = window.open(
          data.url,
          'github_oauth_popup',
          'width=650,height=750,menubar=no,toolbar=no'
        );

        if (!authWindow) {
          setSyncError('Popup blocked by browser. Please enable popups or enter a Personal Access Token below.');
          setShowPatInput(true);
          setIsAuthenticating(false);
        }
      } else {
        setShowPatInput(true);
        setIsAuthenticating(false);
      }
    } catch (e: any) {
      setSyncError('Failed to initiate GitHub OAuth. You can use Personal Access Token below.');
      setShowPatInput(true);
      setIsAuthenticating(false);
    }
  };

  // Save PAT Token manually
  const handleSavePat = async () => {
    if (!patInput.trim()) return;
    setIsAuthenticating(true);
    setSyncError(null);
    try {
      const token = patInput.trim();
      const res = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      if (res.ok) {
        const user = await res.json();
        setAuthToken(token);
        setAuthUser(user);
        localStorage.setItem('apex_gh_token', token);
        localStorage.setItem('apex_gh_user', JSON.stringify(user));
        setPatInput('');
        setShowPatInput(false);
        setSyncSuccessMessage(`Connected via Token as @${user.login}`);
        handleTriggerSync(token);
      } else {
        setSyncError('Invalid GitHub Personal Access Token. Please verify permissions.');
      }
    } catch (e: any) {
      // Fallback
      setAuthToken(patInput.trim());
      localStorage.setItem('apex_gh_token', patInput.trim());
      setShowPatInput(false);
      handleTriggerSync(patInput.trim());
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleDisconnect = () => {
    setAuthToken('');
    setAuthUser(null);
    localStorage.removeItem('apex_gh_token');
    localStorage.removeItem('apex_gh_user');
    setSyncSuccessMessage('Disconnected GitHub account. Using public rate-limited access.');
    checkStatus('');
  };

  // Fetch real live repo data from backend
  const handleTriggerSync = async (overrideToken?: string) => {
    const target = customRepoInput.trim() || selectedRepo;
    if (!target.includes('/')) {
      setSyncError('Please enter a valid repository in "owner/repository" format (e.g., vllm-project/vllm)');
      return;
    }

    const [owner, repo] = target.split('/');
    setIsSyncing(true);
    setSyncError(null);
    setSyncSuccessMessage(null);

    const token = overrideToken !== undefined ? overrideToken : authToken;
    const headers: Record<string, string> = {};
    if (token && !token.startsWith('mock_auth')) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      let res = await fetch(`/api/github/repo/${owner}/${repo}`, { headers });
      
      // If 401 or Bad credentials, retry unauthenticated
      if (res.status === 401) {
        localStorage.removeItem('apex_gh_token');
        localStorage.removeItem('apex_gh_user');
        setAuthToken('');
        setAuthUser(null);
        res = await fetch(`/api/github/repo/${owner}/${repo}`);
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `GitHub API returned ${res.status}`);
      }

      onSyncRepoData(data);
      setSyncSuccessMessage(`Successfully synchronized live repository data for ${data.fullName}!`);
      setTimeout(() => {
        onClose();
      }, 1400);
    } catch (err: any) {
      console.error('GitHub Sync Error:', err);
      // Clean up token if bad credentials
      if (err.message && err.message.toLowerCase().includes('bad credentials')) {
        localStorage.removeItem('apex_gh_token');
        localStorage.removeItem('apex_gh_user');
        setAuthToken('');
        setAuthUser(null);
      }
      setSyncError(err.message || 'Failed to fetch live repository data from GitHub.');
    } finally {
      setIsSyncing(false);
      checkStatus(token);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col transition-all"
        style={{
          backgroundColor: currentTheme.palette.surface,
          borderColor: currentTheme.palette.borderStrong,
          color: currentTheme.palette.textPrimary,
        }}
      >
        {/* Modal Header */}
        <div 
          className="p-5 border-b flex items-center justify-between"
          style={{
            backgroundColor: currentTheme.palette.surfaceRaised,
            borderColor: currentTheme.palette.border,
          }}
        >
          <div className="flex items-center space-x-3">
            <div 
              className="w-9 h-9 rounded-xl flex items-center justify-center border"
              style={{
                backgroundColor: currentTheme.palette.surface,
                borderColor: currentTheme.palette.borderStrong,
              }}
            >
              <FolderGit2 className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight flex items-center space-x-2">
                <span>Sync with GitHub</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  Live API
                </span>
              </h2>
              <p className="text-xs opacity-70">
                Pull authentic repository stars, commits, languages, and READMEs directly from GitHub.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg opacity-70 hover:opacity-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto font-sans">
          {/* Notifications */}
          {syncError && (
            <div className="p-3.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-mono flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{syncError}</div>
            </div>
          )}

          {syncSuccessMessage && (
            <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono flex items-center space-x-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{syncSuccessMessage}</span>
            </div>
          )}

          {/* Authentication Status Card */}
          <div 
            className="p-4 rounded-xl border space-y-3"
            style={{
              backgroundColor: currentTheme.palette.surfaceRaised,
              borderColor: currentTheme.palette.border,
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider opacity-75 flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>GitHub Authentication</span>
              </span>

              {authUser ? (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1">
                  <UserCheck className="w-3 h-3" />
                  <span>Authenticated</span>
                </span>
              ) : (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold opacity-70 border" style={{ borderColor: currentTheme.palette.borderStrong }}>
                  Public API Mode
                </span>
              )}
            </div>

            {authUser ? (
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center space-x-3">
                  {authUser.avatar_url && (
                    <img 
                      src={authUser.avatar_url} 
                      alt={authUser.login} 
                      className="w-10 h-10 rounded-full border"
                      style={{ borderColor: currentTheme.palette.borderStrong }}
                    />
                  )}
                  <div>
                    <div className="text-sm font-bold">{authUser.name || authUser.login}</div>
                    <div className="text-xs font-mono opacity-70">@{authUser.login}</div>
                  </div>
                </div>

                <button
                  onClick={handleDisconnect}
                  className="px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold opacity-70 hover:opacity-100 hover:text-red-400 transition-colors flex items-center space-x-1.5"
                  style={{
                    backgroundColor: currentTheme.palette.surface,
                    borderColor: currentTheme.palette.borderStrong,
                  }}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Disconnect</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3 pt-1">
                <p className="text-xs opacity-75 leading-relaxed">
                  Authenticate with your GitHub account to bypass public rate limits (5,000 req/hr) and sync private or organizational repositories.
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    onClick={handleConnectOAuth}
                    disabled={isAuthenticating}
                    className="px-4 py-2 rounded-lg text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center space-x-2 transition-all shadow-sm disabled:opacity-50"
                    style={{ backgroundColor: currentTheme.palette.accent }}
                  >
                    {isAuthenticating ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Connecting Popup...</span>
                      </>
                    ) : (
                      <>
                        <FolderGit2 className="w-4 h-4" />
                        <span>Connect GitHub Account</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setShowPatInput(!showPatInput)}
                    className="px-3.5 py-2 rounded-lg border text-xs font-mono font-semibold transition-colors opacity-80 hover:opacity-100"
                    style={{
                      backgroundColor: currentTheme.palette.surface,
                      borderColor: currentTheme.palette.borderStrong,
                    }}
                  >
                    <Key className="w-3.5 h-3.5 inline mr-1.5" />
                    <span>{showPatInput ? 'Hide PAT' : 'Use Token / PAT'}</span>
                  </button>
                </div>

                {showPatInput && (
                  <div className="p-3 rounded-lg border space-y-2 pt-3" style={{ borderColor: currentTheme.palette.border }}>
                    <label className="block text-[11px] font-mono font-bold opacity-80">
                      GitHub Personal Access Token (PAT)
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="password"
                        value={patInput}
                        onChange={(e) => setPatInput(e.target.value)}
                        placeholder="ghp_..."
                        className="flex-1 px-3 py-1.5 rounded text-xs font-mono border focus:outline-none"
                        style={{
                          backgroundColor: currentTheme.palette.surface,
                          borderColor: currentTheme.palette.borderStrong,
                          color: currentTheme.palette.textPrimary,
                        }}
                      />
                      <button
                        onClick={handleSavePat}
                        disabled={!patInput.trim() || isAuthenticating}
                        className="px-3 py-1.5 rounded text-xs font-mono font-bold text-white transition-opacity disabled:opacity-50"
                        style={{ backgroundColor: currentTheme.palette.accent }}
                      >
                        Save Token
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {rateLimitInfo && (
              <div className="pt-2 border-t text-[11px] font-mono opacity-65 flex items-center justify-between" style={{ borderColor: currentTheme.palette.border }}>
                <span>GitHub API Quota:</span>
                <span className="font-bold text-emerald-500">{rateLimitInfo.remaining} / {rateLimitInfo.limit} remaining</span>
              </div>
            )}
          </div>

          {/* Target Repository Selection & Live Sync Form */}
          <div className="space-y-3">
            <label className="block text-xs font-mono font-bold uppercase tracking-wider opacity-75">
              Target Repository to Synchronize
            </label>

            <div className="space-y-2">
              <input
                type="text"
                value={customRepoInput}
                onChange={(e) => setCustomRepoInput(e.target.value)}
                placeholder="e.g. vllm-project/vllm or openai/triton"
                className="w-full px-4 py-2.5 rounded-xl border text-sm font-mono focus:outline-none transition-colors"
                style={{
                  backgroundColor: currentTheme.palette.surfaceRaised,
                  borderColor: currentTheme.palette.borderStrong,
                  color: currentTheme.palette.textPrimary,
                }}
              />

              <div className="flex flex-wrap gap-1.5 text-[11px] font-mono opacity-75">
                <span className="opacity-50">Popular targets:</span>
                {['vllm-project/vllm', 'deepseek-ai/DeepSeek-V3', 'openai/triton', 'huggingface/transformers', 'pytorch/pytorch'].map((repo) => (
                  <button
                    key={repo}
                    type="button"
                    onClick={() => setCustomRepoInput(repo)}
                    className="hover:underline text-emerald-500"
                  >
                    {repo.split('/')[1]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Live Synced Repository Preview */}
          {currentLiveRepo && currentLiveRepo.fullName === customRepoInput && (
            <div 
              className="p-4 rounded-xl border space-y-2 text-xs font-mono border-emerald-500/30"
              style={{ backgroundColor: currentTheme.palette.surfaceRaised }}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-500 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Currently Synced with GitHub</span>
                </span>
                <span className="opacity-50 text-[10px]">
                  {new Date(currentLiveRepo.syncedAt).toLocaleTimeString()}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
                <div>
                  <span className="opacity-50 block">Stars</span>
                  <span className="font-bold">{currentLiveRepo.stars?.toLocaleString()} ★</span>
                </div>
                <div>
                  <span className="opacity-50 block">Language</span>
                  <span className="font-bold">{currentLiveRepo.primaryLang}</span>
                </div>
                <div>
                  <span className="opacity-50 block">Latest Commit</span>
                  <span className="font-bold">{currentLiveRepo.lastCommit?.relativeTime}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div 
          className="p-4 border-t flex items-center justify-between"
          style={{
            backgroundColor: currentTheme.palette.surfaceRaised,
            borderColor: currentTheme.palette.border,
          }}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border text-xs font-mono font-semibold transition-colors opacity-80 hover:opacity-100"
            style={{
              backgroundColor: currentTheme.palette.surface,
              borderColor: currentTheme.palette.borderStrong,
            }}
          >
            Cancel
          </button>

          <button
            onClick={() => handleTriggerSync()}
            disabled={isSyncing || !customRepoInput.trim()}
            className="px-6 py-2 rounded-lg text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center space-x-2 shadow-sm transition-all disabled:opacity-50"
            style={{ backgroundColor: currentTheme.palette.accent }}
          >
            {isSyncing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Pulling GitHub API Data...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Pull Live Repository Data</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
