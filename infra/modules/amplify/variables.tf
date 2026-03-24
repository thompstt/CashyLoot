variable "app_name" {
  description = "Amplify app name"
  type        = string
}

variable "repository_url" {
  description = "GitHub repository URL"
  type        = string
}

variable "domain_name" {
  description = "Primary domain name for the app"
  type        = string
}

variable "iam_service_role_arn" {
  description = "IAM service role ARN for Amplify"
  type        = string
}

variable "build_spec" {
  description = "Amplify build specification YAML"
  type        = string
}
