/**
 * Shared fixtures for CMS section tests.
 * Each factory returns a Strapi-shaped section object with sensible defaults.
 * Pass an overrides object to change specific fields.
 */

export function makeHero(overrides = {}) {
  return {
    __component: 'sections.hero',
    headline: 'Test Headline',
    subheadline: 'Test subheadline text.',
    cta_text: 'Learn More',
    cta_link: '/about',
    ...overrides,
  };
}

export function makeTextBlock(overrides = {}) {
  return {
    __component: 'sections.text-block',
    body: '# Hello\n\nTest body content.',
    container_size: 'reading',
    background: 'void',
    overlay: 'none',
    texture: null,
    texture_opacity: 3,
    corners: 'none',
    animation: 'fade-up',
    vertical_spacing: 'normal',
    anchor_id: null,
    enable_prose: true,
    ...overrides,
  };
}

export function makeGallery(overrides = {}) {
  return {
    __component: 'sections.gallery',
    title: 'Our Gallery',
    images: [
      {
        documentId: 'doc1',
        id: 1,
        url: '/uploads/image1.jpg',
        alternativeText: 'Image one',
        name: 'image1.jpg',
      },
      {
        documentId: 'doc2',
        id: 2,
        url: '/uploads/image2.jpg',
        alternativeText: null,
        name: 'image2.jpg',
      },
    ],
    ...overrides,
  };
}

export function makeFaq(overrides = {}) {
  return {
    __component: 'sections.faq',
    items: [
      {
        question: 'What is your return policy?',
        answer: 'We offer a 30-day return policy.',
      },
      {
        question: 'Do you ship internationally?',
        answer: 'Yes, we ship worldwide.',
      },
    ],
    ...overrides,
  };
}

export function makeCta(overrides = {}) {
  return {
    __component: 'sections.cta',
    headline: 'Book a Consultation',
    body: 'Ready to create something unique?',
    button_text: 'Get Started',
    button_link: '/contact',
    ...overrides,
  };
}

export function makeColumnGroup(overrides = {}) {
  return {
    __component: 'sections.column-group',
    columns: [
      { column_name: 'Col A', body: 'First column content.' },
      { column_name: 'Col B', body: 'Second column content.' },
    ],
    ...overrides,
  };
}

export function makeStepGroup(overrides = {}) {
  return {
    __component: 'sections.step-group',
    ...overrides,
  };
}

export function makeImage(overrides = {}) {
  return {
    __component: 'sections.image',
    ...overrides,
  };
}

export function makeButton(overrides = {}) {
  return {
    __component: 'sections.button',
    ...overrides,
  };
}

/**
 * @returns {import('../../../types/cms').StrapiRow}
 */
export function makeRow(overrides = {}) {
  return {
    __component: 'sections.row',
    id: 1,
    columns: [
      { id: 10, column_name: 'Col A', body: 'First column content.' },
      { id: 11, column_name: 'Col B', body: 'Second column content.' },
    ],
    ...overrides,
  };
}
