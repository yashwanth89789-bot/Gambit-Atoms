import React, { useState } from 'react';
import { Terminal, Download, Copy, Check, FileCode, Shield, Layers } from 'lucide-react';
import { useAdaptiveTheme } from '../../context/ThemeContext';

interface IaCManifestViewerProps {
  manifests?: {
    kubernetes: string;
    terraform: string;
    dockerCompose: string;
  };
  designName: string;
}

export const IaCManifestViewer: React.FC<IaCManifestViewerProps> = ({
  manifests,
  designName,
}) => {
  const { currentTheme } = useAdaptiveTheme();
  const [activeTab, setActiveTab] = useState<'kubernetes' | 'terraform' | 'docker' | 'prometheus'>('kubernetes');
  const [copied, setCopied] = useState(false);

  const defaultK8s = manifests?.kubernetes || `# Kubernetes Distributed Inference Manifest
apiVersion: apps/v1
kind: Deployment
metadata:
  name: apex-distributed-mesh
  namespace: production
spec:
  replicas: 8
  selector:
    matchLabels:
      app: apex-inference
  template:
    metadata:
      labels:
        app: apex-inference
    spec:
      containers:
      - name: vllm-engine
        image: vllm/vllm-openai:v0.6.0
        resources:
          limits:
            nvidia.com/gpu: "8"
            memory: 256Gi
        ports:
        - containerPort: 8000`;

  const defaultTf = manifests?.terraform || `# Terraform Multi-Region Distributed GPU Cluster
terraform {
  required_version = ">= 1.6.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.40"
    }
  }
}

resource "aws_eks_cluster" "apex_gpu_cluster" {
  name     = "apex-ai-primary"
  role_arn = aws_iam_role.cluster_role.arn
  version  = "1.30"
}`;

  const defaultDocker = manifests?.dockerCompose || `version: '3.8'
services:
  inference-gateway:
    image: apexai/gateway:v3.2
    ports:
      - "8000:8000"
    environment:
      - TP_SIZE=4
      - PP_SIZE=2`;

  const defaultPrometheus = `# Prometheus SLA & Alerting Rules for GPU Inference
groups:
- name: apex_ai_slos
  rules:
  - alert: HighInferenceLatencyP99
    expr: histogram_quantile(0.99, sum(rate(vllm_request_latency_seconds_bucket[5m])) by (le)) > 0.05
    for: 2m
    labels:
      severity: critical
    annotations:
      summary: "P99 latency exceeding 50ms threshold"
  - alert: GPUVRAMFragmentation
    expr: (gpu_memory_used_bytes / gpu_memory_total_bytes) > 0.95
    for: 1m
    labels:
      severity: warning`;

  const getActiveCode = () => {
    switch (activeTab) {
      case 'kubernetes': return defaultK8s;
      case 'terraform': return defaultTf;
      case 'docker': return defaultDocker;
      case 'prometheus': return defaultPrometheus;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getActiveCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = activeTab === 'terraform' ? 'tf' : 'yaml';
    const filename = `${designName.toLowerCase().replace(/\s+/g, '_')}_${activeTab}.${ext}`;
    const blob = new Blob([getActiveCode()], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div 
      className="border rounded-xl p-5 md:p-6 transition-all duration-300 shadow-sm space-y-4"
      style={{
        backgroundColor: currentTheme.palette.surface,
        borderColor: currentTheme.palette.border,
        color: currentTheme.palette.textPrimary,
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b"
        style={{ borderColor: currentTheme.palette.border }}
      >
        <div className="flex items-center space-x-3">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center border"
            style={{
              backgroundColor: currentTheme.palette.surfaceRaised,
              borderColor: currentTheme.palette.borderStrong,
              color: currentTheme.palette.accent,
            }}
          >
            <FileCode className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base tracking-tight">Infrastructure as Code (IaC) Deployment Studio</h3>
            <p className="text-xs opacity-70">Production-grade manifests generated for Kubernetes, Terraform, Docker & Prometheus</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md border text-xs font-mono font-medium transition-all"
            style={{
              backgroundColor: currentTheme.palette.surfaceRaised,
              borderColor: currentTheme.palette.border,
            }}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md border text-xs font-mono font-medium transition-all"
            style={{
              backgroundColor: currentTheme.palette.surfaceRaised,
              borderColor: currentTheme.palette.border,
            }}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Spec</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b overflow-x-auto" style={{ borderColor: currentTheme.palette.border }}>
        {[
          { id: 'kubernetes', label: 'Kubernetes (K8s)', ext: '.yaml' },
          { id: 'terraform', label: 'Terraform (AWS/GCP)', ext: '.tf' },
          { id: 'docker', label: 'Docker Compose', ext: '.yml' },
          { id: 'prometheus', label: 'Prometheus SLOs', ext: '.yaml' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2 text-xs font-mono border-b-2 transition-all shrink-0 ${
              activeTab === tab.id
                ? 'font-bold'
                : 'opacity-60 hover:opacity-100 border-transparent'
            }`}
            style={activeTab === tab.id ? { borderColor: currentTheme.palette.accent, color: currentTheme.palette.accent } : {}}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Code Editor Preview Window */}
      <pre 
        className="p-4 rounded-xl border text-xs font-mono overflow-x-auto leading-relaxed max-h-[340px]"
        style={{
          backgroundColor: currentTheme.appearance === 'light' ? '#18181B' : '#09090B',
          borderColor: '#27272A',
          color: '#E4E4E7',
        }}
      >
        <code>{getActiveCode()}</code>
      </pre>
    </div>
  );
};
