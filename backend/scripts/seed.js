'use strict';

/**
 * Seed script — run after first Strapi launch to create example pages.
 *
 * Usage (from /backend directory):
 *   npm run seed
 */
async function seed() {
  const strapi = await require('@strapi/strapi').createStrapi().load();

  const existing = await strapi.entityService.findMany('api::page.page', {
    filters: { slug: 'commissions' },
  });

  if (existing.length === 0) {
    await strapi.entityService.create('api::page.page', {
      data: {
        title: 'Commissions',
        slug: 'commissions',
        seo_description:
          'Commission a one-of-a-kind piece — black spinel, forged metal, and seventh-generation craft.',
        sections: [
          {
            __component: 'sections.hero',
            headline: 'Commission Something Built to Last',
            subheadline:
              'Every piece begins with a conversation. We work with a small number of clients each year to create rings and jewelry that carry genuine weight.',
            cta_text: 'Book a Consultation',
            cta_link: '/consultation',
          },
          {
            __component: 'sections.text-block',
            heading: 'What to Expect',
            body: '<p>The commission process takes 8–16 weeks from first conversation to final delivery. We source stones directly from our artisan network, and metalwork is handled by multigenerational workshops we have worked with for years.</p><p>There are no surprises. We discuss budget, materials, and timeline before any work begins.</p>',
            alignment: 'left',
          },
          {
            __component: 'sections.faq',
            items: [
              {
                question: 'What is the minimum budget for a commission?',
                answer:
                  'Custom commissions start at $2,000. This covers a single stone ring in 14kt gold with standard sizing. Complex metalwork or larger stones will increase the price.',
              },
              {
                question: 'How long does the process take?',
                answer:
                  'Most commissions are completed in 8–16 weeks. We will give you a specific timeline after our initial consultation.',
              },
              {
                question: 'Can I see the stone before it is set?',
                answer:
                  'Yes. We photograph stones and send them to you for approval before any metalwork begins.',
              },
            ],
          },
          {
            __component: 'sections.cta',
            headline: 'Ready to Start?',
            body: 'No obligation. No sales pitch. Just a conversation about what you want.',
            button_text: 'Book Free Consultation',
            button_link: '/consultation',
          },
        ],
        publishedAt: new Date().toISOString(),
      },
    });
    console.log('Seeded: Commissions page');
  } else {
    console.log('Seed already exists — skipping.');
  }

  await strapi.destroy();
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
