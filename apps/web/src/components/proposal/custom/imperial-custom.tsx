'use client';

import type { Proposal } from '@repo/shared';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Zap, Shield, Layers, TrendingUp, Check, ArrowRight } from 'lucide-react';

interface ImperialCustomProps {
  proposal: Proposal;
}

/**
 * Imperial - Aureon Connect
 * Modern proposal with Framer Motion animations
 */
export default function ImperialCustomProposal({ proposal }: ImperialCustomProps) {
  const { client, proposal: content } = proposal;

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${client.colors.primary} 0%, ${client.colors.accent} 100%)`
        }}
      >
        <div className="mx-auto max-w-7xl px-6 py-20 relative">
          {/* Imperial Logo - Top-right corner */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-4 right-6 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20"
          >
            <Image
              src={client.logo}
              alt={`${client.name} Logo`}
              width={120}
              height={40}
              className="h-8 w-auto opacity-90"
              priority
            />
          </motion.div>

          {/* Tractis Badge - Bottom-left corner - More prominent */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="absolute bottom-6 left-6 bg-white/20 backdrop-blur-md px-5 py-3 rounded-xl border-2 border-white/30 shadow-lg"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs text-white font-semibold">Powered by</span>
              <Image
                src="/logos/tractis-white.svg"
                alt="Tractis"
                width={100}
                height={32}
                className="h-6 w-auto"
              />
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center pt-8"
          >
            <h1 className="text-6xl md:text-7xl font-bold mb-6" style={{ color: '#ffffff' }}>
              Aureon Connect
            </h1>
            <p className="text-2xl md:text-3xl font-medium max-w-4xl mx-auto" style={{ color: '#ffffff' }}>
              Integrador Universal de Última Milla
            </p>
            <p className="text-lg mt-4" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              Para Ecommerce y Operadores Logísticos
            </p>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto"
          >
            {[
              { value: '48h', label: 'Integración' },
              { value: '100%', label: 'Agnóstico' },
              { value: '0', label: 'Vendor Lock-in' }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-5xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-sm text-white/80 mt-2">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      <div className="mx-auto max-w-7xl px-6 py-20 space-y-32">

        {/* Problem Section */}
        <motion.section
          {...fadeIn}
          className="p-12 rounded-3xl"
          style={{
            background: `linear-gradient(135deg, ${client.colors.primary}08 0%, ${client.colors.accent}08 100%)`
          }}
        >
          <div className="text-center mb-16">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="inline-block p-3 rounded-full mb-4"
              style={{ backgroundColor: `${client.colors.primary}20` }}
            >
              <Zap size={32} style={{ color: client.colors.primary }} />
            </motion.div>
            <h2 className="text-4xl font-bold mb-4" style={{ color: client.colors.primary }}>
              El Problema
            </h2>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: '#374151' }}>
              Dependencia crítica de un solo proveedor TMS limita su red de transportes
            </p>
          </div>

          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {content.needs.map((need, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group p-6 rounded-xl bg-white border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 font-bold text-white"
                  style={{ backgroundColor: client.colors.primary }}
                >
                  {index + 1}
                </div>
                <p className="leading-relaxed" style={{ color: '#374151' }}>{need}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Solution Section */}
        <motion.section
          {...fadeIn}
          className="p-12 rounded-3xl"
          style={{
            background: `linear-gradient(135deg, ${client.colors.accent}08 0%, ${client.colors.primary}08 100%)`
          }}
        >
          <div className="text-center mb-16">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="inline-block p-3 rounded-full mb-4"
              style={{ backgroundColor: `${client.colors.accent}20` }}
            >
              <Layers size={32} style={{ color: client.colors.accent }} />
            </motion.div>
            <h2 className="text-4xl font-bold mb-4" style={{ color: client.colors.primary }}>
              La Solución
            </h2>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: '#374151' }}>
              Middleware agnóstico que traduce automáticamente entre cualquier TMS
            </p>
          </div>

          {/* Visual Diagram */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 p-8 rounded-2xl bg-white border border-gray-200"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 max-w-5xl mx-auto">

              {/* Left: Multiple TMS Systems */}
              <motion.div
                initial={{ x: -30, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex-1 text-center"
              >
                <div className="text-sm font-semibold mb-3" style={{ color: client.colors.accent }}>
                  Sistemas de Transportes
                </div>
                <div className="space-y-3">
                  {[
                    { name: 'Beetrack', color: '#FF6B35', icon: '🚚' },
                    { name: 'Driv.in', color: '#4A90E2', icon: '🛣️' },
                    { name: 'Simpliroute', color: '#00C48C', icon: '📍' },
                    { name: 'Excel', color: '#217346', icon: '📊' }
                  ].map((system, i) => (
                    <div
                      key={i}
                      className="px-4 py-3 rounded-lg bg-white border-2 flex items-center justify-center gap-2 h-14 hover:shadow-md transition-shadow"
                      style={{ borderColor: system.color }}
                    >
                      <span className="text-xl">{system.icon}</span>
                      <span className="text-sm font-bold" style={{ color: system.color }}>
                        {system.name}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Arrow */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="flex-shrink-0"
              >
                <ArrowRight size={40} style={{ color: client.colors.primary }} />
              </motion.div>

              {/* Center: Aureon Connect */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="flex-1 text-center"
              >
                <div
                  className="px-6 py-8 rounded-xl border-2 shadow-lg relative"
                  style={{
                    borderColor: client.colors.primary,
                    background: `linear-gradient(135deg, ${client.colors.primary}10 0%, ${client.colors.accent}10 100%)`
                  }}
                >
                  <Layers size={40} className="mx-auto mb-2" style={{ color: client.colors.primary }} />
                  <div className="text-xl font-bold" style={{ color: client.colors.primary }}>
                    Aureon Connect
                  </div>
                  <div className="text-xs mt-1 mb-3" style={{ color: '#6B7280' }}>
                    Traducción Automática
                  </div>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <span className="text-[9px]" style={{ color: '#9CA3AF' }}>by</span>
                    <Image
                      src="/logos/tractis-color.svg"
                      alt="Tractis"
                      width={50}
                      height={16}
                      className="h-3 w-auto opacity-60"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Arrow */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
                className="flex-shrink-0"
              >
                <ArrowRight size={40} style={{ color: client.colors.primary }} />
              </motion.div>

              {/* Right: Client TMS */}
              <motion.div
                initial={{ x: 30, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1 }}
                className="flex-1 text-center"
              >
                <div className="text-sm font-semibold mb-3" style={{ color: client.colors.accent }}>
                  Tu TMS
                </div>
                <div
                  className="px-6 py-6 rounded-xl shadow-md"
                  style={{
                    background: `linear-gradient(135deg, ${client.colors.primary} 0%, ${client.colors.accent} 100%)`
                  }}
                >
                  <div className="text-white font-bold text-lg">Vista Unificada</div>
                  <div className="text-white/80 text-xs mt-2">
                    Todos los transportes en un solo lugar
                  </div>
                </div>
              </motion.div>

            </div>
          </motion.div>

          {/* Immediate Benefits */}
          <div className="space-y-6 mb-12">
            {[
              {
                icon: <Zap size={28} />,
                title: 'Eliminar Fricción para Agregar Transportes',
                points: [
                  '¿Encontraste un transportista que usa Beetrack? Lo agregamos en 48 horas',
                  '¿Necesitas capacidad urgente y el transporte usa Excel? Lo configuramos igual',
                  'Sin capacitación, sin integración técnica compleja'
                ]
              },
              {
                icon: <Shield size={28} />,
                title: 'Reducir Riesgo Operativo Crítico',
                points: [
                  'Tu continuidad operativa ya no depende de un solo proveedor',
                  'Puedes migrar de TMS sin perder tu red de transportes',
                  'Mantén flexibilidad tecnológica sin sacrificar operación'
                ]
              },
              {
                icon: <TrendingUp size={28} />,
                title: 'Escalar Sin Límites Tecnológicos',
                points: [
                  'Cada nuevo transporte que encuentres puede integrarse',
                  'La calidad del servicio es el único criterio de selección',
                  'Tu red crece según necesidades del negocio, no limitaciones técnicas'
                ]
              },
              {
                icon: <Layers size={28} />,
                title: 'Visibilidad Unificada',
                points: [
                  'Todos los transportes visibles en tu TMS actual',
                  'Formato estándar independiente del sistema origen',
                  'Trazabilidad completa sin importar heterogeneidad de proveedores'
                ]
              }
            ].map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="p-6 rounded-xl bg-white border-l-4 hover:shadow-lg transition-shadow"
                style={{ borderLeftColor: client.colors.primary }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 p-3 rounded-lg"
                    style={{ backgroundColor: `${client.colors.primary}15`, color: client.colors.primary }}
                  >
                    {benefit.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-3" style={{ color: client.colors.primary }}>
                      {benefit.title}
                    </h3>
                    <ul className="space-y-2">
                      {benefit.points.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check size={18} className="flex-shrink-0 mt-0.5" style={{ color: client.colors.primary }} />
                          <span className="text-sm" style={{ color: '#374151' }}>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Tech Badge with Tractis Branding */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-8 text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Image
                src="/logos/tractis-color.svg"
                alt="Tractis"
                width={80}
                height={24}
                className="h-5 w-auto opacity-70"
              />
            </div>
            <p className="text-sm" style={{ color: '#6B7280' }}>
              Tecnología empresarial probada y escalable
            </p>
          </motion.div>
        </motion.section>

        {/* Pricing Section */}
        <motion.section
          {...fadeIn}
          className="p-12 rounded-3xl"
          style={{
            background: `linear-gradient(135deg, ${client.colors.primary}05 0%, ${client.colors.accent}05 100%)`
          }}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{ color: client.colors.primary }}>
              Inversión
            </h2>
            <p className="text-xl" style={{ color: '#374151' }}>
              Modelos flexibles para tu operación
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {content.pricing.tiers?.map((tier, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.03 }}
                className={`relative p-8 rounded-2xl border-2 ${
                  tier.recommended ? 'shadow-2xl' : 'shadow-lg'
                }`}
                style={{
                  borderColor: tier.recommended ? client.colors.primary : '#e5e7eb',
                  backgroundColor: tier.recommended ? `${client.colors.primary}05` : 'white'
                }}
              >
                {tier.recommended && (
                  <div
                    className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-sm font-bold text-white"
                    style={{ backgroundColor: client.colors.primary }}
                  >
                    RECOMENDADO
                  </div>
                )}

                <h3 className="text-2xl font-bold mb-4" style={{ color: client.colors.accent }}>
                  {tier.name}
                </h3>

                <div className="mb-6">
                  <div className="text-4xl font-bold" style={{ color: client.colors.primary }}>
                    {tier.price}
                  </div>
                  {tier.period && (
                    <div className="text-sm mt-1" style={{ color: '#4B5563' }}>{tier.period}</div>
                  )}
                </div>

                <ul className="space-y-3">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3" style={{ color: '#374151' }}>
                      <Check size={20} style={{ color: client.colors.primary }} className="flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl p-12 text-center text-white"
          style={{
            background: `linear-gradient(135deg, ${client.colors.primary} 0%, ${client.colors.accent} 100%)`
          }}
        >
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-4" style={{ color: '#ffffff' }}>
              ¿Listo para eliminar el vendor lock-in?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Agenda una demo de 30 minutos y ve Aureon Connect en acción
            </p>

            <motion.a
              href={content.contact.calendlyUrl || `mailto:${content.contact.email}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-shadow"
              style={{ color: client.colors.primary }}
            >
              Agendar Demo
              <ArrowRight size={20} />
            </motion.a>

            <div className="mt-8 flex items-center justify-center gap-6 text-sm">
              <a
                href={`mailto:${content.contact.email}?subject=Consulta sobre Aureon Connect&body=Hola ${content.contact.name},%0D%0A%0D%0AMe interesa conocer más sobre Aureon Connect.%0D%0A%0D%0ASaludos,`}
                className="transition-colors"
                style={{ color: '#ffffff' }}
              >
                📧 {content.contact.email}
              </a>
              <a
                href={`https://wa.me/${content.contact.phone.replace(/[^0-9]/g, '')}?text=Hola, me interesa conocer más sobre Aureon Connect`}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors"
                style={{ color: '#ffffff' }}
              >
                📱 {content.contact.phone}
              </a>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        </motion.section>
      </div>

      {/* Footer with Tractis Branding */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs text-gray-500">Powered by</span>
            <a
              href="https://tractis.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform hover:scale-105"
            >
              <Image
                src="/logos/tractis-color.svg"
                alt="Tractis AI"
                width={90}
                height={28}
                className="h-6 w-auto"
              />
            </a>
            <span className="text-xs text-gray-400">• {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
