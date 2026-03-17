{
  "name": "WaitlistSignup",
  "type": "object",
  "properties": {
    "email": {
      "type": "string",
      "format": "email",
      "description": "Email address of the interested customer"
    },
    "name": {
      "type": "string",
      "description": "Full name of the interested customer"
    },
    "interest": {
      "type": "string",
      "enum": [
        "engagement_rings",
        "statement_pieces",
        "gaming_artifacts",
        "custom_commission"
      ],
      "description": "What type of jewelry calls to them"
    }
  },
  "required": [
    "email",
    "name",
    "interest"
  ]
}