'use client';

import { useState } from 'react';
import { nanoid } from 'nanoid';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function AdminPage() {
  const [formData, setFormData] = useState({
    clientName: '',
    slug: '',
    websiteUrl: '',
    logoPath: '',
    primaryColor: '#e6c15c',
    accentColor: '#5e6b7b',
    executiveSummary: '',
    needs: '',
    solution: '',
    whyUs: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    calendlyUrl: '',
  });

  const [generatedToken, setGeneratedToken] = useState('');
  const [generatedProposal, setGeneratedProposal] = useState('');

  const handleGenerateToken = () => {
    setGeneratedToken(nanoid(10));
  };

  const handleGenerateProposal = () => {
    const token = generatedToken || nanoid(10);
    const slug = formData.slug || formData.clientName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const proposal = {
      slug,
      token,
      client: {
        name: formData.clientName,
        logo: formData.logoPath || '/logos/tractis-color.svg',
        colors: {
          primary: formData.primaryColor,
          accent: formData.accentColor,
        },
      },
      proposal: {
        executiveSummary: formData.executiveSummary,
        needs: formData.needs.split('\n').filter(n => n.trim()),
        solution: formData.solution,
        features: [], // TODO: Add features form
        roadmap: [], // TODO: Add roadmap form
        whyUs: formData.whyUs.split('\n').filter(w => w.trim()),
        pricing: {
          tiers: [],
          customNote: '',
        },
        contact: {
          name: formData.contactName,
          email: formData.contactEmail,
          phone: formData.contactPhone,
          calendlyUrl: formData.calendlyUrl,
          nextSteps: [],
        },
      },
    };

    setGeneratedProposal(JSON.stringify(proposal, null, 2));
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generatedProposal);
    alert('Proposal JSON copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Proposal Generator</h1>
          <p className="text-muted-foreground">
            Create customer proposals quickly and easily
          </p>
        </div>

        {/* Form */}
        <Card className="p-6 space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Client Information</h2>

            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Client Name *
                </label>
                <input
                  type="text"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Acme Corporation"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Slug (URL-friendly name)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="acme-corp (auto-generated if blank)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Website URL
                </label>
                <input
                  type="url"
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="https://acme.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Logo Path
                </label>
                <input
                  type="text"
                  value={formData.logoPath}
                  onChange={(e) => setFormData({ ...formData, logoPath: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="/logos/acme-corp.svg (uses Tractis if blank)"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Primary Color
                  </label>
                  <input
                    type="color"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    className="w-full h-10 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Accent Color
                  </label>
                  <input
                    type="color"
                    value={formData.accentColor}
                    onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                    className="w-full h-10 border rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Proposal Content</h2>

            <div>
              <label className="block text-sm font-medium mb-2">
                Executive Summary *
              </label>
              <textarea
                value={formData.executiveSummary}
                onChange={(e) => setFormData({ ...formData, executiveSummary: e.target.value })}
                className="w-full px-3 py-2 border rounded-md min-h-32"
                placeholder="Brief overview of the proposal..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Client Needs (one per line) *
              </label>
              <textarea
                value={formData.needs}
                onChange={(e) => setFormData({ ...formData, needs: e.target.value })}
                className="w-full px-3 py-2 border rounded-md min-h-32"
                placeholder="Automate manual processes&#10;Improve decision-making&#10;Scale operations"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Solution Overview *
              </label>
              <textarea
                value={formData.solution}
                onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                className="w-full px-3 py-2 border rounded-md min-h-32"
                placeholder="How we'll solve their problems..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Why Us (one per line) *
              </label>
              <textarea
                value={formData.whyUs}
                onChange={(e) => setFormData({ ...formData, whyUs: e.target.value })}
                className="w-full px-3 py-2 border rounded-md min-h-32"
                placeholder="Proven track record&#10;Deep expertise&#10;Transparent communication"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Contact Information</h2>

            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Contact Name *
                </label>
                <input
                  type="text"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Gerhard Neumann"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Contact Email *
                </label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="gerhard@tractis.ai"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Calendly URL
                </label>
                <input
                  type="url"
                  value={formData.calendlyUrl}
                  onChange={(e) => setFormData({ ...formData, calendlyUrl: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="https://calendly.com/tractis/demo"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Security Token</h2>

            <div className="flex gap-4">
              <input
                type="text"
                value={generatedToken}
                onChange={(e) => setGeneratedToken(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-md font-mono"
                placeholder="Click generate or enter custom token"
                readOnly
              />
              <Button onClick={handleGenerateToken}>
                Generate Token
              </Button>
            </div>
          </div>

          <div className="flex gap-4">
            <Button onClick={handleGenerateProposal} className="flex-1" size="lg">
              Generate Proposal JSON
            </Button>
          </div>
        </Card>

        {/* Generated Output */}
        {generatedProposal && (
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Generated Proposal</h2>
              <Button onClick={handleCopyToClipboard} variant="outline">
                Copy to Clipboard
              </Button>
            </div>

            <div className="bg-muted p-4 rounded-md overflow-auto max-h-96">
              <pre className="text-sm">
                <code>{generatedProposal}</code>
              </pre>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm">
              <p className="font-semibold mb-2">Next Steps:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Copy the JSON above</li>
                <li>Add logo file to <code className="bg-blue-100 px-1 rounded">public/logos/</code></li>
                <li>Add this object to <code className="bg-blue-100 px-1 rounded">src/data/proposals.ts</code></li>
                <li>Add features, roadmap, and pricing sections manually</li>
                <li>Commit and push to deploy</li>
              </ol>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
