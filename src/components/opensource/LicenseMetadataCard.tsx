import React, { useState, useMemo } from 'react';
import { 
  FileText, Shield, AlertTriangle, CheckCircle2, XCircle, Info, 
  Copy, Check, Scale, Eye, FileCode, ChevronDown, ChevronUp, 
  Sparkles, RefreshCw, Layers, ShieldCheck, ShieldAlert, BookOpen
} from 'lucide-react';
import { useAdaptiveTheme } from '../../context/ThemeContext';

export interface LicenseMetadata {
  spdxId: string;
  name: string;
  category: 'Permissive' | 'Weak Copyleft' | 'Strong Copyleft' | 'Network Copyleft' | 'Proprietary / Custom';
  permissivenessScore: number; // 0 - 100
  commercialUse: 'Allowed' | 'Restricted' | 'Prohibited';
  patentGrant: 'Explicit' | 'Implicit / None' | 'Patent Retaliation Clause';
  copyleftRequirement: 'None (Permissive)' | 'File-level (Weak)' | 'Viral Library-level (GPL)' | 'Network Trigger (AGPL)';
  sourceDisclosure: 'Not Required' | 'Same Files Only' | 'Entire Project Source' | 'Network Users on SaaS';
  attributionRequired: boolean;
  stateChangesRequired: boolean;
  trademarkGrant: boolean;
  liabilityWarranty: 'No Warranty / As-Is' | 'Limited';
  warnings: Array<{
    severity: 'critical' | 'warning' | 'info' | 'positive';
    title: string;
    description: string;
    badgeText: string;
  }>;
  rawText: string;
}

const MOCK_LICENSES: Record<string, LicenseMetadata> = {
  'vllm-project/vllm': {
    spdxId: 'Apache-2.0',
    name: 'Apache License 2.0',
    category: 'Permissive',
    permissivenessScore: 96,
    commercialUse: 'Allowed',
    patentGrant: 'Explicit',
    copyleftRequirement: 'None (Permissive)',
    sourceDisclosure: 'Not Required',
    attributionRequired: true,
    stateChangesRequired: true,
    trademarkGrant: false,
    liabilityWarranty: 'No Warranty / As-Is',
    warnings: [
      {
        severity: 'positive',
        title: 'Commercial Exploitation Permitted',
        description: 'You may freely bundle, sell, or host this software for commercial SaaS platforms without royalty obligations.',
        badgeText: 'Commercial Use Permitted',
      },
      {
        severity: 'positive',
        title: 'Explicit Patent Protection',
        description: 'Grants an express patent license from every contributor to users and downstream distributors.',
        badgeText: 'Patent Grant Included',
      },
      {
        severity: 'info',
        title: 'Notice & Modification Tracking',
        description: 'Requires retaining the original copyright notice and stating prominent notices on modified files.',
        badgeText: 'Attribution & NOTICE Required',
      },
      {
        severity: 'warning',
        title: 'No Trademark Rights',
        description: 'Does not grant permission to use the trade names, trademarks, or service marks of contributors.',
        badgeText: 'Trademark Rights Excluded',
      },
    ],
    rawText: `Apache License
Version 2.0, January 2004
http://www.apache.org/licenses/

TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

1. Definitions.
"License" shall mean the terms and conditions for use, reproduction, and distribution as defined by Sections 1 through 9 of this document.

2. Grant of Copyright License. Subject to the terms and conditions of this License, each Contributor hereby grants to You a perpetual, worldwide, non-exclusive, no-charge, royalty-free, irrevocable copyright license to reproduce, prepare Derivative Works of, publicly display, publicly perform, sublicense, and distribute the Work and such Derivative Works in Source or Object form.

3. Grant of Patent License. Subject to the terms and conditions of this License, each Contributor hereby grants to You a perpetual, worldwide, non-exclusive, no-charge, royalty-free, irrevocable patent license to make, have made, use, offer to sell, sell, import, and otherwise transfer the Work.

4. Redistribution. You may reproduce and distribute copies of the Work or Derivative Works thereof in any medium, with or without modifications, and in Source or Object form, provided that You meet the following conditions:
(a) You must give any other recipients of the Work or Derivative Works a copy of this License; and
(b) You must cause any modified files to carry prominent notices stating that You changed the files; and
(c) You must retain, in the Source form of any Derivative Works that You distribute, all copyright, patent, trademark, and attribution notices from the Source form of the Work.`,
  },
  'huggingface/transformers': {
    spdxId: 'Apache-2.0',
    name: 'Apache License 2.0',
    category: 'Permissive',
    permissivenessScore: 96,
    commercialUse: 'Allowed',
    patentGrant: 'Explicit',
    copyleftRequirement: 'None (Permissive)',
    sourceDisclosure: 'Not Required',
    attributionRequired: true,
    stateChangesRequired: true,
    trademarkGrant: false,
    liabilityWarranty: 'No Warranty / As-Is',
    warnings: [
      {
        severity: 'positive',
        title: 'Enterprise Friendly',
        description: 'Zero copyleft contamination. Can be embedded inside proprietary enterprise inference stacks.',
        badgeText: 'Commercial Friendly',
      },
      {
        severity: 'positive',
        title: 'Patent Protection Included',
        description: 'Protects contributors and downstream users against patent infringement claims from other contributors.',
        badgeText: 'Explicit Patent Grant',
      },
      {
        severity: 'info',
        title: 'Attribution Notice',
        description: 'Must include NOTICE file and original copyright header in source distributions.',
        badgeText: 'Retain Copyright Header',
      },
    ],
    rawText: `Copyright 2020 The HuggingFace Team. All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.`,
  },
  'pytorch/pytorch': {
    spdxId: 'BSD-3-Clause',
    name: 'BSD 3-Clause "New" or "Revised" License',
    category: 'Permissive',
    permissivenessScore: 94,
    commercialUse: 'Allowed',
    patentGrant: 'Implicit / None',
    copyleftRequirement: 'None (Permissive)',
    sourceDisclosure: 'Not Required',
    attributionRequired: true,
    stateChangesRequired: false,
    trademarkGrant: false,
    liabilityWarranty: 'No Warranty / As-Is',
    warnings: [
      {
        severity: 'positive',
        title: 'Maximum Permissiveness',
        description: 'Allows distribution and modification with minimal legal friction in both open and proprietary software.',
        badgeText: 'Permissive Non-Copyleft',
      },
      {
        severity: 'info',
        title: 'No Endorsement Clause',
        description: 'The name of PyTorch or contributors may not be used to endorse or promote derived commercial products without prior written permission.',
        badgeText: 'No Unapproved Endorsement',
      },
      {
        severity: 'warning',
        title: 'Implicit Patent Terms',
        description: 'Does not contain an explicit patent grant clause; relies on general copyright permission.',
        badgeText: 'No Express Patent Clause',
      },
    ],
    rawText: `BSD 3-Clause License

Copyright (c) 2016- 2026, Facebook, Inc. (Meta Platforms, Inc.) and PyTorch contributors.
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED.`,
  },
  'openai/triton': {
    spdxId: 'MIT',
    name: 'MIT License',
    category: 'Permissive',
    permissivenessScore: 99,
    commercialUse: 'Allowed',
    patentGrant: 'Implicit / None',
    copyleftRequirement: 'None (Permissive)',
    sourceDisclosure: 'Not Required',
    attributionRequired: true,
    stateChangesRequired: false,
    trademarkGrant: true,
    liabilityWarranty: 'No Warranty / As-Is',
    warnings: [
      {
        severity: 'positive',
        title: 'Highest Legal Permissiveness',
        description: 'Short, clean, permissive license allowing any use, modification, distribution, or commercialization.',
        badgeText: 'Near-Universal Permissiveness (99%)',
      },
      {
        severity: 'positive',
        title: 'Zero Source Disclosure',
        description: 'Compiled GPU kernels and custom Triton IR passes can be closed and shipped in proprietary binaries.',
        badgeText: 'No Source Disclosure Needed',
      },
      {
        severity: 'info',
        title: 'Retain MIT Header',
        description: 'Single requirement: keep the short MIT copyright statement in copies or substantial portions.',
        badgeText: 'Simple Attribution Requirement',
      },
    ],
    rawText: `MIT License

Copyright (c) 2021 OpenAI Triton contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.`,
  },
  'deepseek-ai/DeepSeek-V3': {
    spdxId: 'DeepSeek-Open-Weights',
    name: 'DeepSeek Model & Code Community License',
    category: 'Permissive',
    permissivenessScore: 88,
    commercialUse: 'Allowed',
    patentGrant: 'Explicit',
    copyleftRequirement: 'None (Permissive)',
    sourceDisclosure: 'Not Required',
    attributionRequired: true,
    stateChangesRequired: true,
    trademarkGrant: false,
    liabilityWarranty: 'No Warranty / As-Is',
    warnings: [
      {
        severity: 'positive',
        title: 'Commercial AI Inference Permitted',
        description: 'Free for enterprise and commercial applications, subject to compliance with acceptable use policies.',
        badgeText: 'Commercial Deployment Permitted',
      },
      {
        severity: 'info',
        title: 'Model Derivative Attribution',
        description: 'Must include clear notice stating that derived weights or fine-tunes are built on top of DeepSeek-V3.',
        badgeText: 'Downstream Model Attribution',
      },
      {
        severity: 'warning',
        title: 'Acceptable Use Policy (AUP)',
        description: 'Restricts generation of unlawful content, autonomous military kinetic systems, and malicious malware.',
        badgeText: 'Acceptable AI Use Compliance',
      },
    ],
    rawText: `DeepSeek Community License Agreement
Version 1.0

1. GRANT OF RIGHTS. DeepSeek hereby grants you a royalty-free, worldwide, non-exclusive, irrevocable license to reproduce, distribute, perform, display, and create derivative works of the DeepSeek Model, Weights, and Associated Software.

2. COMMERCIAL USE. You may monetize the software and model outputs, integrate into enterprise API gateways, and distribute derivative fine-tunes without license fees.

3. ATTRIBUTION. You must provide prominent credit to DeepSeek on any distributed derivative model or service.

4. ACCEPTABLE USE. You agree not to use the Model or its outputs to violate applicable laws, develop chemical/biological weapons, or generate malware.`,
  },
  'ggerganov/llama.cpp': {
    spdxId: 'MIT',
    name: 'MIT License',
    category: 'Permissive',
    permissivenessScore: 98,
    commercialUse: 'Allowed',
    patentGrant: 'Implicit / None',
    copyleftRequirement: 'None (Permissive)',
    sourceDisclosure: 'Not Required',
    attributionRequired: true,
    stateChangesRequired: false,
    trademarkGrant: true,
    liabilityWarranty: 'No Warranty / As-Is',
    warnings: [
      {
        severity: 'positive',
        title: 'Permissive Edge C++ Runtime',
        description: 'Can be linked statically into mobile apps, edge devices, and proprietary desktop binaries.',
        badgeText: 'Permissive Static Linking',
      },
      {
        severity: 'positive',
        title: 'No Viral Ingestion',
        description: 'Safe for commercial embedded firmware and quantized tensor serving.',
        badgeText: 'Proprietary Embedding Safe',
      },
      {
        severity: 'info',
        title: 'Model Weights Distinction',
        description: 'Note that the C++ inference code is MIT, but quantized model weights (GGUF) inherit their respective creator licenses.',
        badgeText: 'Check Loaded Weight Licenses',
      },
    ],
    rawText: `MIT License

Copyright (c) 2023-2026 Georgi Gerganov and llama.cpp contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.`,
  },
  'generic/gpl3-example': {
    spdxId: 'GPL-3.0-only',
    name: 'GNU General Public License v3.0',
    category: 'Strong Copyleft',
    permissivenessScore: 54,
    commercialUse: 'Allowed',
    patentGrant: 'Explicit',
    copyleftRequirement: 'Viral Library-level (GPL)',
    sourceDisclosure: 'Entire Project Source',
    attributionRequired: true,
    stateChangesRequired: true,
    trademarkGrant: false,
    liabilityWarranty: 'No Warranty / As-Is',
    warnings: [
      {
        severity: 'critical',
        title: 'Strong Viral Copyleft Trigger',
        description: 'Linking or combining with proprietary code requires releasing the entire combined software under GPLv3.',
        badgeText: 'Reciprocal Viral Copyleft',
      },
      {
        severity: 'critical',
        title: 'Mandatory Source Code Disclosure',
        description: 'Any distributed binary must provide complete corresponding source code to end users.',
        badgeText: 'Disclose Complete Source',
      },
      {
        severity: 'positive',
        title: 'Patent Peace & Tivoization Defense',
        description: 'Explicit patent license with anti-circumvention and hardware locking protections.',
        badgeText: 'Anti-Tivoization & Patents',
      },
    ],
    rawText: `GNU GENERAL PUBLIC LICENSE
Version 3, 29 June 2007

Copyright (C) 2007 Free Software Foundation, Inc. <https://fsf.org/>
Everyone is permitted to copy and distribute verbatim copies of this license document.

The GNU General Public License is a free, copyleft license for software and other kinds of works.
When we speak of free software, we are referring to freedom, not price. Our General Public Licenses are designed to make sure that you have the freedom to distribute copies of free software.
If you convey a covered work, you must provide the Corresponding Source to the recipient.`,
  },
  'generic/agpl3-example': {
    spdxId: 'AGPL-3.0-only',
    name: 'GNU Affero General Public License v3.0',
    category: 'Network Copyleft',
    permissivenessScore: 36,
    commercialUse: 'Allowed',
    patentGrant: 'Explicit',
    copyleftRequirement: 'Network Trigger (AGPL)',
    sourceDisclosure: 'Network Users on SaaS',
    attributionRequired: true,
    stateChangesRequired: true,
    trademarkGrant: false,
    liabilityWarranty: 'No Warranty / As-Is',
    warnings: [
      {
        severity: 'critical',
        title: 'Cloud / SaaS Network Trigger',
        description: 'Providing access over a computer network (cloud API) triggers the obligation to disclose complete source code to all network users.',
        badgeText: 'Cloud SaaS Disclose Trigger (AGPL)',
      },
      {
        severity: 'critical',
        title: 'Proprietary Backend Risk',
        description: 'High legal exposure if included in closed backend microservices.',
        badgeText: 'High Enterprise SaaS Risk',
      },
    ],
    rawText: `GNU AFFERO GENERAL PUBLIC LICENSE
Version 3, 19 November 2007

Copyright (C) 2007 Free Software Foundation, Inc. <https://fsf.org/>

Section 13: Remote Network Interaction; Network Use.
Notwithstanding any other provision of this License, if you modify the Program, your modified version must prominently offer all users interacting with it remotely through a computer network an opportunity to receive the Corresponding Source of your version.`,
  },
};

interface LicenseMetadataCardProps {
  selectedRepo: string;
  onSelectRepo?: (repo: string) => void;
}

export const LicenseMetadataCard: React.FC<LicenseMetadataCardProps> = ({ selectedRepo, onSelectRepo }) => {
  const { currentTheme } = useAdaptiveTheme();
  const [activeLicenseKey, setActiveLicenseKey] = useState<string>(selectedRepo || 'vllm-project/vllm');
  const [showRawLicense, setShowRawLicense] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'matrix' | 'raw'>('overview');

  // Keep state synced when selectedRepo prop updates from parent
  React.useEffect(() => {
    if (selectedRepo && MOCK_LICENSES[selectedRepo]) {
      setActiveLicenseKey(selectedRepo);
    }
  }, [selectedRepo]);

  const handleSelectChange = (newKey: string) => {
    setActiveLicenseKey(newKey);
    if (onSelectRepo && !newKey.startsWith('generic/')) {
      onSelectRepo(newKey);
    }
  };

  const licenseData: LicenseMetadata = MOCK_LICENSES[activeLicenseKey] || MOCK_LICENSES[selectedRepo] || MOCK_LICENSES['vllm-project/vllm'];

  const handleCopyRaw = () => {
    navigator.clipboard.writeText(licenseData.rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return { bg: 'bg-emerald-500', text: 'text-emerald-500', border: 'border-emerald-500/30', badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' };
    if (score >= 75) return { bg: 'bg-blue-500', text: 'text-blue-500', border: 'border-blue-500/30', badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' };
    if (score >= 50) return { bg: 'bg-amber-500', text: 'text-amber-500', border: 'border-amber-500/30', badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' };
    return { bg: 'bg-red-500', text: 'text-red-500', border: 'border-red-500/30', badge: 'bg-red-500/10 text-red-600 dark:text-red-400' };
  };

  const scoreTheme = getScoreColor(licenseData.permissivenessScore);

  return (
    <div 
      className="border rounded-2xl p-6 lg:p-7 shadow-sm space-y-6 transition-all"
      style={{
        backgroundColor: currentTheme.palette.surface,
        borderColor: currentTheme.palette.border,
        color: currentTheme.palette.textPrimary,
      }}
    >
      {/* Header with License Selector & SPDX Pill */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b"
        style={{ borderColor: currentTheme.palette.border }}
      >
        <div className="flex items-center space-x-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center border shadow-xs"
            style={{
              backgroundColor: currentTheme.palette.surfaceRaised,
              borderColor: currentTheme.palette.borderStrong,
              color: currentTheme.palette.accent,
            }}
          >
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-base sm:text-lg tracking-tight">License Parser & Compliance Inspector</h3>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30">
                SPDX: {licenseData.spdxId}
              </span>
            </div>
            <p className="text-xs opacity-70">
              Mock license parser analyzing legal risk, commercial rights, patent grants, and copyleft triggers
            </p>
          </div>
        </div>

        {/* License Switcher Dropdown */}
        <div className="flex items-center space-x-2">
          <label className="text-[11px] font-mono opacity-60 shrink-0">Sample License:</label>
          <select
            value={activeLicenseKey}
            onChange={(e) => handleSelectChange(e.target.value)}
            className="rounded-lg px-3 py-1.5 text-xs font-mono border transition-colors focus:outline-none cursor-pointer focus:ring-1"
            style={{
              backgroundColor: currentTheme.palette.surfaceRaised,
              borderColor: currentTheme.palette.borderStrong,
              color: currentTheme.palette.textPrimary,
            }}
          >
            <option value="vllm-project/vllm" style={{ backgroundColor: currentTheme.palette.surfaceRaised, color: currentTheme.palette.textPrimary }}>vllm-project/vllm (Apache-2.0)</option>
            <option value="huggingface/transformers" style={{ backgroundColor: currentTheme.palette.surfaceRaised, color: currentTheme.palette.textPrimary }}>huggingface/transformers (Apache-2.0)</option>
            <option value="pytorch/pytorch" style={{ backgroundColor: currentTheme.palette.surfaceRaised, color: currentTheme.palette.textPrimary }}>pytorch/pytorch (BSD-3-Clause)</option>
            <option value="openai/triton" style={{ backgroundColor: currentTheme.palette.surfaceRaised, color: currentTheme.palette.textPrimary }}>openai/triton (MIT)</option>
            <option value="deepseek-ai/DeepSeek-V3" style={{ backgroundColor: currentTheme.palette.surfaceRaised, color: currentTheme.palette.textPrimary }}>deepseek-ai/DeepSeek-V3 (Community)</option>
            <option value="ggerganov/llama.cpp" style={{ backgroundColor: currentTheme.palette.surfaceRaised, color: currentTheme.palette.textPrimary }}>ggerganov/llama.cpp (MIT)</option>
            <option value="generic/gpl3-example" style={{ backgroundColor: currentTheme.palette.surfaceRaised, color: currentTheme.palette.textPrimary }}>GNU GPL-3.0 (Viral Copyleft)</option>
            <option value="generic/agpl3-example" style={{ backgroundColor: currentTheme.palette.surfaceRaised, color: currentTheme.palette.textPrimary }}>GNU AGPL-3.0 (Network SaaS Trigger)</option>
          </select>
        </div>
      </div>

      {/* Main Highlights Grid: Permissiveness Score Meter + Key Legal Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Permissiveness Score Card (4 cols) */}
        <div 
          className="lg:col-span-4 p-5 rounded-xl border flex flex-col justify-between space-y-4"
          style={{
            backgroundColor: currentTheme.palette.surfaceRaised,
            borderColor: currentTheme.palette.border,
          }}
        >
          <div>
            <div className="flex items-center justify-between text-xs font-mono mb-1">
              <span className="opacity-70 font-semibold uppercase tracking-wider">Permissiveness Score</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${scoreTheme.badge} ${scoreTheme.border}`}>
                {licenseData.category}
              </span>
            </div>
            
            <div className="flex items-baseline space-x-2 my-2">
              <span className={`text-4xl font-extrabold font-mono tracking-tight ${scoreTheme.text}`}>
                {licenseData.permissivenessScore}%
              </span>
              <span className="text-xs font-mono opacity-60">/ 100 Permissive</span>
            </div>

            {/* Visual Gauge Progress Bar */}
            <div className="w-full h-3 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden relative my-3">
              <div 
                className={`h-full rounded-full transition-all duration-700 ${scoreTheme.bg}`}
                style={{ width: `${licenseData.permissivenessScore}%` }}
              />
            </div>

            <p className="text-xs opacity-75 leading-relaxed">
              {licenseData.permissivenessScore >= 90
                ? 'Ultra-low legal risk for enterprise and proprietary integration with zero viral copyleft obligations.'
                : licenseData.permissivenessScore >= 70
                ? 'Permissive commercial terms with specific attribution or model acceptable use policy conditions.'
                : 'Contains reciprocal copyleft or network distribution obligations requiring architectural isolation.'}
            </p>
          </div>

          {/* Quick Stats Matrix */}
          <div className="space-y-2 pt-3 border-t text-xs font-mono" style={{ borderColor: currentTheme.palette.border }}>
            <div className="flex items-center justify-between">
              <span className="opacity-70">Commercial Use:</span>
              <span className="font-bold text-emerald-500 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{licenseData.commercialUse}</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="opacity-70">Patent Grant:</span>
              <span className="font-bold opacity-90">{licenseData.patentGrant}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="opacity-70">Copyleft Viral Scope:</span>
              <span className="font-bold opacity-90">{licenseData.copyleftRequirement}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Legal Warning Badges & Clause Diagnostics (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-widest font-mono flex items-center space-x-2 opacity-80">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <span>Parsed Legal Warning Badges & Ingestion Guidance</span>
            </h4>

            {/* View Mode Toggle Buttons */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                  activeTab === 'overview' ? 'font-bold border' : 'opacity-60 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: activeTab === 'overview' ? currentTheme.palette.surfaceRaised : 'transparent',
                  borderColor: currentTheme.palette.borderStrong,
                }}
              >
                Badges
              </button>
              <button
                onClick={() => setActiveTab('matrix')}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                  activeTab === 'matrix' ? 'font-bold border' : 'opacity-60 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: activeTab === 'matrix' ? currentTheme.palette.surfaceRaised : 'transparent',
                  borderColor: currentTheme.palette.borderStrong,
                }}
              >
                Rights Matrix
              </button>
              <button
                onClick={() => setActiveTab('raw')}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors flex items-center space-x-1 ${
                  activeTab === 'raw' ? 'font-bold border' : 'opacity-60 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: activeTab === 'raw' ? currentTheme.palette.surfaceRaised : 'transparent',
                  borderColor: currentTheme.palette.borderStrong,
                }}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>Raw File</span>
              </button>
            </div>
          </div>

          {/* TAB 1: Legal Warning Badges View */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fadeIn">
              {licenseData.warnings.map((w, i) => {
                const isCritical = w.severity === 'critical';
                const isWarning = w.severity === 'warning';
                const isPositive = w.severity === 'positive';

                const badgeBg = isCritical 
                  ? 'bg-red-500/10 text-red-500 border-red-500/30' 
                  : isWarning 
                  ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' 
                  : isPositive 
                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' 
                  : 'bg-blue-500/10 text-blue-500 border-blue-500/30';

                return (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl border flex flex-col justify-between space-y-2 transition-colors"
                    style={{
                      backgroundColor: currentTheme.palette.surfaceRaised,
                      borderColor: currentTheme.palette.border,
                    }}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${badgeBg}`}>
                          {w.badgeText}
                        </span>
                        {isCritical ? (
                          <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                        ) : isPositive ? (
                          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                        ) : (
                          <Info className="w-4 h-4 text-blue-500 shrink-0" />
                        )}
                      </div>
                      <h5 className="text-xs font-bold font-sans">{w.title}</h5>
                      <p className="text-xs opacity-75 leading-relaxed mt-1">{w.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: Rights & Compliance Matrix */}
          {activeTab === 'matrix' && (
            <div 
              className="p-4 rounded-xl border space-y-3 font-mono text-xs animate-fadeIn"
              style={{
                backgroundColor: currentTheme.palette.surfaceRaised,
                borderColor: currentTheme.palette.border,
              }}
            >
              <div className="grid grid-cols-3 gap-2 pb-2 border-b font-bold opacity-70 text-[11px] uppercase tracking-wider"
                style={{ borderColor: currentTheme.palette.border }}
              >
                <span>Legal Scope</span>
                <span>Requirement</span>
                <span>Audit Status</span>
              </div>

              <div className="grid grid-cols-3 gap-2 items-center py-1">
                <span className="opacity-80">Commercial SaaS Hosting</span>
                <span>{licenseData.commercialUse}</span>
                <span className="text-emerald-500 flex items-center space-x-1 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approved</span>
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 items-center py-1">
                <span className="opacity-80">Source Disclosure (Copyleft)</span>
                <span>{licenseData.sourceDisclosure}</span>
                <span className={licenseData.sourceDisclosure === 'Not Required' ? 'text-emerald-500 font-bold' : 'text-red-500 font-bold'}>
                  {licenseData.sourceDisclosure === 'Not Required' ? 'Safe (No Viral Risk)' : 'Action Required'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 items-center py-1">
                <span className="opacity-80">Patent Protection Grant</span>
                <span>{licenseData.patentGrant}</span>
                <span className="text-blue-500 font-bold">Verified</span>
              </div>

              <div className="grid grid-cols-3 gap-2 items-center py-1">
                <span className="opacity-80">Attribution Notice</span>
                <span>{licenseData.attributionRequired ? 'Must Retain Header/Notice' : 'Optional'}</span>
                <span className="text-amber-500 font-bold">Header Audit</span>
              </div>
            </div>
          )}

          {/* TAB 3: Raw License Text File Viewer */}
          {activeTab === 'raw' && (
            <div className="space-y-2 animate-fadeIn">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="opacity-70 flex items-center space-x-1">
                  <FileText className="w-3.5 h-3.5 text-blue-500" />
                  <span>LICENSE / COPYRIGHT Root Manifest ({licenseData.name})</span>
                </span>
                <button
                  onClick={handleCopyRaw}
                  className="px-2 py-1 rounded border text-[11px] font-mono flex items-center space-x-1 opacity-80 hover:opacity-100 transition-colors"
                  style={{
                    backgroundColor: currentTheme.palette.surfaceRaised,
                    borderColor: currentTheme.palette.border,
                  }}
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy Text'}</span>
                </button>
              </div>

              <pre 
                className="p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-52 leading-relaxed border"
                style={{
                  backgroundColor: currentTheme.appearance === 'light' ? '#18181B' : '#09090B',
                  borderColor: '#27272A',
                  color: '#E4E4E7',
                }}
              >
                <code>{licenseData.rawText}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
