import { Client } from '@repo/shared';

interface BlockComponentProps {
  data: Record<string, unknown>;
  client: Client;
}

interface SetupFee {
  item: string;
  cost: string | number;
  description?: string;
}

interface Tier {
  name: string;
  price: string | number;
  period: string;
  features: string[];
  recommended?: boolean;
}

interface AddOn {
  name: string;
  price: string | number;
  description: string;
}

interface RoiProjection {
  label: string;
  value: string | number;
  description?: string;
}

export function PricingDetailed({ data, client }: BlockComponentProps) {
  const sectionTitle = (data.sectionTitle as string) || '';
  const setupFees = Array.isArray(data.setupFees) ? (data.setupFees as SetupFee[]) : [];
  const tiers = Array.isArray(data.tiers) ? (data.tiers as Tier[]) : [];
  const addOns = Array.isArray(data.addOns) ? (data.addOns as AddOn[]) : [];
  const roiProjections = Array.isArray(data.roiProjections) ? (data.roiProjections as RoiProjection[]) : [];

  if (setupFees.length === 0 && tiers.length === 0 && addOns.length === 0 && roiProjections.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      {sectionTitle && (
        <h2 className="text-3xl font-bold" style={{ color: client.colors.primary }}>
          {sectionTitle}
        </h2>
      )}

      {/* Setup Fees Section */}
      {setupFees.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold">Setup Fees</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ backgroundColor: client.colors.primary, color: 'white' }}>
                  <th className="p-3 text-left">Item</th>
                  <th className="p-3 text-right">Cost</th>
                  <th className="p-3 text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                {setupFees.map((fee, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="p-3 font-medium">{fee.item}</td>
                    <td className="p-3 text-right font-semibold">{fee.cost}</td>
                    <td className="p-3 text-gray-600">{fee.description || ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pricing Tiers Section */}
      {tiers.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold">Pricing Tiers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tiers.map((tier, idx) => (
              <div
                key={idx}
                className="border rounded-lg p-6 relative"
                style={{
                  borderColor: tier.recommended ? client.colors.accent : '#e5e7eb',
                  borderWidth: tier.recommended ? '2px' : '1px'
                }}
              >
                {tier.recommended && (
                  <div
                    className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-white text-sm font-semibold"
                    style={{ backgroundColor: client.colors.accent }}
                  >
                    Recommended
                  </div>
                )}
                <h4 className="text-xl font-bold mb-2" style={{ color: client.colors.primary }}>
                  {tier.name}
                </h4>
                <div className="mb-4">
                  <span className="text-3xl font-bold" style={{ color: client.colors.primary }}>
                    {tier.price}
                  </span>
                  <span className="text-gray-600 ml-2">/ {tier.period}</span>
                </div>
                <ul className="space-y-2">
                  {Array.isArray(tier.features) && tier.features.map((feature, featureIdx) => (
                    <li key={featureIdx} className="flex items-start">
                      <svg
                        className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0"
                        style={{ color: client.colors.accent }}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add-ons Section */}
      {addOns.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold">Add-ons</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ backgroundColor: client.colors.primary, color: 'white' }}>
                  <th className="p-3 text-left">Add-on</th>
                  <th className="p-3 text-right">Price</th>
                  <th className="p-3 text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                {addOns.map((addOn, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="p-3 font-medium">{addOn.name}</td>
                    <td className="p-3 text-right font-semibold">{addOn.price}</td>
                    <td className="p-3 text-gray-600">{addOn.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ROI Projections Section */}
      {roiProjections.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold">ROI Projections</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roiProjections.map((projection, idx) => (
              <div key={idx} className="border rounded-lg p-6" style={{ borderColor: client.colors.primary }}>
                <div className="text-sm text-gray-600 mb-1">{projection.label}</div>
                <div className="text-3xl font-bold mb-2" style={{ color: client.colors.accent }}>
                  {projection.value}
                </div>
                {projection.description && (
                  <p className="text-sm text-gray-600">{projection.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
