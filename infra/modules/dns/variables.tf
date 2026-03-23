variable "domain_name" {
  description = "Domain name"
  type        = string
}

variable "hosted_zone_id" {
  description = "Existing Route 53 hosted zone ID (used for import)"
  type        = string
}

variable "ses_dkim_tokens" {
  description = "DKIM tokens from SES module"
  type        = list(string)
}
