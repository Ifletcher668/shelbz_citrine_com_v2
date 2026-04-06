'use strict';

// ── View configuration for contact-form and form.input-field ─────────────────

const CONTACT_FORM_VIEW = {
  uid: 'api::contact-form.contact-form',
  settings: {
    bulkable: true,
    filterable: true,
    searchable: true,
    pageSize: 10,
    mainField: 'title',
    defaultSortBy: 'title',
    defaultSortOrder: 'ASC',
  },
  metadatas: {
    id: {
      edit: {},
      list: { label: 'ID', searchable: false, sortable: true },
    },
    title: {
      edit: { label: 'Internal Title', description: '', placeholder: '', visible: true, editable: true },
      list: { label: 'Title', searchable: true, sortable: true },
    },
    action: {
      edit: { label: 'Form Action', description: '', placeholder: '', visible: true, editable: true },
      list: { label: 'Action', searchable: false, sortable: true },
    },
    fields: {
      edit: { label: 'Form Fields', description: '', placeholder: '', visible: true, editable: true },
      list: { label: 'Fields', searchable: false, sortable: false },
    },
    submit_label: {
      edit: { label: 'Submit Button Label', description: '', placeholder: '', visible: true, editable: true },
      list: { label: 'Submit Label', searchable: false, sortable: false },
    },
    success_message: {
      edit: { label: 'Success Message', description: '', placeholder: '', visible: true, editable: true },
      list: { label: 'Success Message', searchable: false, sortable: false },
    },
    layout: {
      edit: {
        label: 'Field Layout',
        description: 'Arrange form fields into rows and set their widths (1–12 grid). Fields not included fall back to full-width stacking.',
        placeholder: '',
        visible: true,
        editable: true,
      },
      list: { label: 'Layout', searchable: false, sortable: false },
    },
  },
  layouts: {
    list: ['id', 'title', 'action'],
    edit: [
      [{ name: 'title', size: 6 }, { name: 'action', size: 6 }],
      [{ name: 'fields', size: 12 }],
      [{ name: 'submit_label', size: 6 }, { name: 'success_message', size: 6 }],
      [{ name: 'layout', size: 12 }],
    ],
  },
};

const INPUT_FIELD_VIEW = {
  uid: 'form.input-field',
  isComponent: true,
  settings: {
    bulkable: true,
    filterable: true,
    searchable: true,
    pageSize: 10,
    mainField: 'label',
    defaultSortBy: 'label',
    defaultSortOrder: 'ASC',
  },
  metadatas: {
    id: {
      edit: {},
      list: { label: 'ID', searchable: false, sortable: true },
    },
    label: {
      edit: { label: 'Field Label', description: '', placeholder: '', visible: true, editable: true },
      list: { label: 'Label', searchable: true, sortable: true },
    },
    name: {
      edit: {
        label: 'HTML Field Name',
        description: 'Used as the name attribute. Letters, numbers, hyphens and underscores only.',
        placeholder: '',
        visible: true,
        editable: true,
      },
      list: { label: 'Name', searchable: true, sortable: true },
    },
    type: {
      edit: { label: 'Input Type', description: '', placeholder: '', visible: true, editable: true },
      list: { label: 'Type', searchable: false, sortable: true },
    },
    placeholder: {
      edit: { label: 'Placeholder', description: '', placeholder: '', visible: true, editable: true },
      list: { label: 'Placeholder', searchable: false, sortable: false },
    },
    required: {
      edit: { label: 'Required?', description: '', placeholder: '', visible: true, editable: true },
      list: { label: 'Required', searchable: false, sortable: false },
    },
    help_text: {
      edit: {
        label: 'Help Text',
        description: 'Shown below the field in the rendered form.',
        placeholder: '',
        visible: true,
        editable: true,
      },
      list: { label: 'Help Text', searchable: false, sortable: false },
    },
  },
  layouts: {
    list: ['id', 'label', 'name', 'type', 'required'],
    edit: [
      [{ name: 'label', size: 6 }, { name: 'name', size: 6 }],
      [{ name: 'type', size: 4 }, { name: 'required', size: 4 }, { name: 'placeholder', size: 4 }],
      [{ name: 'help_text', size: 12 }],
    ],
  },
};

async function configureContactFormView(strapi) {
  const store = strapi.store({ type: 'plugin', name: 'content-manager' });
  await store.set({
    key: 'configuration_content_types::api::contact-form.contact-form',
    value: CONTACT_FORM_VIEW,
  });
  await store.set({
    key: 'configuration_components::form.input-field',
    value: INPUT_FIELD_VIEW,
  });
  strapi.log.info('[bootstrap] Contact Form admin view configured.');
}

module.exports = {
  register(/*{ strapi }*/) {},

  /**
   * Auto-grants public read permissions for all API content types used by the
   * Next.js frontend. Also configures the Contact Form admin view layout.
   */
  async bootstrap({ strapi }) {
    // ── Public permissions ────────────────────────────────────────────────────
    const publicRole = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'public' } });

    if (!publicRole) return;

    const existing = await strapi
      .query('plugin::users-permissions.permission')
      .findMany({ where: { role: publicRole.id } });

    const needs = (action) => !existing.some((p) => p.action === action);

    const toCreate = [
      'api::page.page.find',
      'api::page.page.findOne',
      'api::header.header.find',
      'api::theme.theme.find',
      'api::theme.theme.findOne',
      'api::faq.faq.find',
      'api::faq.faq.findOne',
      'api::bullet-list.bullet-list.find',
      'api::bullet-list.bullet-list.findOne',
      'api::step-group.step-group.find',
      'api::step-group.step-group.findOne',
      'api::contact-form.contact-form.find',
      'api::contact-form.contact-form.findOne',
    ]
      .filter(needs)
      .map((action) => ({ action, role: publicRole.id }));

    for (const perm of toCreate) {
      await strapi.query('plugin::users-permissions.permission').create({ data: perm });
    }

    if (toCreate.length > 0) {
      strapi.log.info(`[bootstrap] Public permissions granted (${toCreate.length} added).`);
    }

    // ── Contact Form admin view ───────────────────────────────────────────────
    await configureContactFormView(strapi);
  },
};
