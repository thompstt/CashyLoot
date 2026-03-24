variable "amplify_role_name" {
  description = "Name of the Amplify SSR IAM role"
  type        = string
}

variable "project_name" {
  description = "Project name for resource naming"
  type        = string
}

variable "github_repo" {
  description = "GitHub repository (owner/name format)"
  type        = string
}
