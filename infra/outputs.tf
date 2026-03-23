output "vpc_id" {
  description = "VPC ID"
  value       = module.networking.vpc_id
}

output "db_cluster_endpoint" {
  description = "RDS cluster endpoint"
  value       = module.database.cluster_endpoint
}

output "ses_domain_arn" {
  description = "SES domain identity ARN"
  value       = module.email.domain_arn
}

output "hosted_zone_id" {
  description = "Route 53 hosted zone ID"
  value       = module.dns.zone_id
}
