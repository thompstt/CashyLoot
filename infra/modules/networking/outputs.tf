output "vpc_id" {
  description = "VPC ID"
  value       = aws_vpc.main.id
}

output "db_security_group_id" {
  description = "Database security group ID"
  value       = aws_security_group.db.id
}
