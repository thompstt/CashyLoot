output "amplify_role_arn" {
  description = "Amplify SSR role ARN"
  value       = aws_iam_role.amplify_ssr.arn
}

output "mcp_admin_arn" {
  description = "mcp-admin user ARN"
  value       = aws_iam_user.mcp_admin.arn
}
