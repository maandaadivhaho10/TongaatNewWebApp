import React from 'react';
import { Shield, Building2, Landmark, Factory, Truck } from 'lucide-react';

export default function TrustBanner() {
  const partners = [
    { name: 'AfriAgri Capital', icon: Landmark, type: 'Development Finance' },
    { name: 'Apex Foods & Processing', icon: Factory, type: 'Corporate Buyer' },
    { name: 'TransContinental Logistics', icon: Truck, type: 'Supply Chain Partner' },
    { name: 'National Enterprise Development', icon: Building2, type: 'Government Initiative' },
    { name: 'Greenfields Agri Fund', icon: Shield, type: 'Impact Capital' },
  ];

  return (
    <section id="trust-network" className="py-10 bg-neutral-50 border-y border-neutral-200 text-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="shrink-0 text-center md:text-left">
            <span className="text-[11px] uppercase tracking-wider text-neutral-500 font-semibold block mb-0.5">
              Enterprise Ecosystem
            </span>
            <span className="text-sm font-semibold text-neutral-800">
              Trusted by Corporate Buyers & ESD Funds
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 sm:gap-4">
            {partners.map((partner, index) => {
              const Icon = partner.icon;
              return (
                <div 
                  key={index} 
                  className="flex items-center space-x-2.5 px-3.5 py-2 rounded-lg bg-white border border-neutral-200 shadow-xs hover:border-neutral-300 transition-colors"
                >
                  <div className="w-6 h-6 rounded bg-neutral-100 flex items-center justify-center text-neutral-700">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-semibold text-neutral-900 block">{partner.name}</span>
                    <span className="text-[10px] text-neutral-500 font-medium block">{partner.type}</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
