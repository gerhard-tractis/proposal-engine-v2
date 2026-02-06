'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { proposals } from '@/data/proposals';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'create' | 'dashboard'>('dashboard');

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="/logos/tractis-white.svg"
              alt="Tractis"
              width={140}
              height={40}
              className="h-10 w-auto"
              priority
            />
            <div className="border-l border-border pl-4">
              <h1 className="text-4xl font-bold">Proposal Admin</h1>
              <p className="text-muted-foreground">Create and manage customer proposals</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant={activeTab === 'dashboard' ? 'default' : 'outline'}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </Button>
            <Button
              variant={activeTab === 'create' ? 'default' : 'outline'}
              onClick={() => setActiveTab('create')}
            >
              Create Proposal
            </Button>
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && <ProposalDashboard />}

        {/* Create Tab */}
        {activeTab === 'create' && <CreateProposal />}
      </div>
    </div>
  );
}

function ProposalDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">All Proposals ({proposals.length})</h2>
      </div>

      <div className="grid gap-4">
        {proposals.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No proposals yet. Create your first one!</p>
          </Card>
        ) : (
          proposals.map((proposal) => (
            <Card key={proposal.slug} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold">{proposal.client.name}</h3>
                    <Badge variant="outline" className="font-mono text-xs">
                      {proposal.slug}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {proposal.proposal.executiveSummary}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor: proposal.client.colors.primary }}
                      />
                      <span className="font-mono">{proposal.client.colors.primary}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor: proposal.client.colors.accent }}
                      />
                      <span className="font-mono">{proposal.client.colors.accent}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <Link href={`/proposals/${proposal.slug}/${proposal.token}`} target="_blank">
                    <Button variant="default" size="sm">
                      View Proposal
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const url = `${window.location.origin}/proposals/${proposal.slug}/${proposal.token}`;
                      navigator.clipboard.writeText(url);
                      alert('URL copied to clipboard!');
                    }}
                  >
                    Copy URL
                  </Button>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t flex items-center justify-between text-xs text-muted-foreground">
                <div className="font-mono">
                  Token: {proposal.token}
                </div>
                <div>
                  {proposal.proposal.features.length} features · {proposal.proposal.roadmap.length} roadmap items
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

function CreateProposal() {
  const [formData, setFormData] = useState({
    clientName: '',
    websiteUrl: '',
    logoFile: null as File | null,
    proposalFile: null as File | null,
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (field: 'logoFile' | 'proposalFile', file: File | null) => {
    setFormData({ ...formData, [field]: file });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // TODO: Implement agent workflow
    // 1. Upload files
    // 2. Call Agent 1 (brand extraction from website)
    // 3. Call Agent 2 (content generation from uploaded doc)
    // 4. Generate token
    // 5. Save proposal
    // 6. Commit to git or save to DB

    alert('Agent integration coming soon! For now, this will trigger:\n\n' +
          '1. Agent 1: Scrape ' + formData.websiteUrl + ' for brand colors\n' +
          '2. Agent 2: Parse uploaded document and generate 8-section proposal\n' +
          '3. Auto-generate token and save\n' +
          '4. Deploy and return URL');

    setIsProcessing(false);
  };

  return (
    <Card className="p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Create New Proposal</h2>
          <p className="text-sm text-muted-foreground">
            Our AI agents will extract branding from the website and generate proposal content from your document.
          </p>
        </div>

        <div className="space-y-4">
          {/* Client Name */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Client Name *
            </label>
            <input
              type="text"
              required
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Acme Corporation"
            />
          </div>

          {/* Website URL */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Website URL *
            </label>
            <input
              type="url"
              required
              value={formData.websiteUrl}
              onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="https://acme.com"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Agent 1 will extract brand colors, fonts, and styling from this website
            </p>
          </div>

          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Upload Logo *
            </label>
            <input
              type="file"
              required
              accept=".svg,.png,.jpg,.jpeg"
              onChange={(e) => handleFileChange('logoFile', e.target.files?.[0] || null)}
              className="w-full px-3 py-2 border rounded-md"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Accepted formats: SVG, PNG, JPG
            </p>
          </div>

          {/* Proposal Content Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Upload Proposal Content *
            </label>
            <input
              type="file"
              required
              accept=".pdf,.md,.docx,.txt"
              onChange={(e) => handleFileChange('proposalFile', e.target.files?.[0] || null)}
              className="w-full px-3 py-2 border rounded-md"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Accepted formats: PDF, Markdown, DOCX, TXT<br />
              Agent 2 will parse this document and generate the 8-section proposal structure
            </p>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm space-y-2">
          <p className="font-semibold">What happens when you submit:</p>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li><strong>Agent 1 (Brand Extraction):</strong> Scrapes website, analyzes logo, extracts brand colors</li>
            <li><strong>Agent 2 (Content Generation):</strong> Parses your document, generates 8-section proposal</li>
            <li><strong>Auto-Processing:</strong> Generates secure token, uses Tractis contact info</li>
            <li><strong>Deployment:</strong> Saves proposal and returns shareable URL</li>
          </ol>
        </div>

        {/* Contact Info (Read-only) */}
        <div className="bg-muted p-4 rounded-md">
          <p className="text-sm font-medium mb-2">Contact Information (Auto-filled)</p>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Name: Gerhard Neumann</p>
            <p>Email: gerhard@tractis.ai</p>
            <p>Phone: +1 (555) 123-4567</p>
            <p>Calendly: https://calendly.com/tractis/demo</p>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing with AI Agents...' : 'Create Proposal with AI'}
        </Button>

        {/* Status */}
        <div className="text-center text-sm text-muted-foreground">
          <p>⚠️ Agent integration in progress - Coming soon!</p>
          <p className="text-xs mt-1">Current: Manual workflow via form submission</p>
        </div>
      </form>
    </Card>
  );
}
