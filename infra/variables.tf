variable "aws_region" {
  description = "AWS region for all resources"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name used for resource naming and tagging"
  type        = string
  default     = "cashyloot"
}

variable "environment" {
  description = "Environment name (production, staging, dev)"
  type        = string
  default     = "production"
}

variable "domain_name" {
  description = "Primary domain name"
  type        = string
}

variable "hosted_zone_id" {
  description = "Route 53 hosted zone ID for the domain"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "db_security_group_id" {
  description = "Security group ID for database access"
  type        = string
}

variable "db_cluster_id" {
  description = "RDS Aurora cluster identifier"
  type        = string
}

variable "db_subnet_group_name" {
  description = "RDS subnet group name"
  type        = string
}

variable "db_min_capacity" {
  description = "Aurora Serverless v2 minimum ACU"
  type        = number
  default     = 0.5
}

variable "db_max_capacity" {
  description = "Aurora Serverless v2 maximum ACU"
  type        = number
  default     = 128.0
}

variable "amplify_role_name" {
  description = "Name of the Amplify SSR IAM role"
  type        = string
}

variable "repository_url" {
  description = "GitHub repository URL for Amplify"
  type        = string
}

variable "github_repo" {
  description = "GitHub repository in owner/name format (for OIDC)"
  type        = string
}
