import { COMPONENT_REGISTRY } from './blocks';
import { ProposalErrorBoundary } from './proposal-error-boundary';
import type { Block, Client } from '@repo/shared';

interface BlockRendererProps {
  blocks: Block[];
  client: Client;
}

export function BlockRenderer({ blocks, client }: BlockRendererProps) {
  return (
    <>
      {blocks.map((block) => {
        const Component = COMPONENT_REGISTRY[block.component];
        if (!Component) {
          if (process.env.NODE_ENV !== 'production') {
            console.warn(`Unknown block component: "${block.component}" (block id: ${block.id})`);
          }
          return null;
        }
        return (
          <ProposalErrorBoundary key={block.id}>
            <Component data={block.data} client={client} />
          </ProposalErrorBoundary>
        );
      })}
    </>
  );
}
