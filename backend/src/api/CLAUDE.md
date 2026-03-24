80% of the content types defined here will utilize the wysiwyg-editor component as its only component type. The wysiwyg itself has the ability to create and reference numerous other "components."

Complex components, like bullet-list, are defined in the api to be used as a reference inside the wysiwyg. Simple component types, like buttons or images, are not their own api/component type, but are rather simple buttons/markdown tags inside the wysiwyg.

Follow this pattern for all new api/component types unless otherwise stated.
