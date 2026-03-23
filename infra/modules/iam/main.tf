terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Amplify SSR execution role
resource "aws_iam_role" "amplify_ssr" {
  name = var.amplify_role_name

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "amplify.amazonaws.com"
      }
    }]
  })
}

# SES SendEmail inline policy on the Amplify role
resource "aws_iam_role_policy" "ses_send" {
  name = "SES-SendEmail"
  role = aws_iam_role.amplify_ssr.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = "ses:SendEmail"
      Resource = "*"
    }]
  })
}

# mcp-admin IAM user — documented for visibility
# TODO: Scope down from PowerUserAccess to least-privilege policy
resource "aws_iam_user" "mcp_admin" {
  name = "mcp-admin"
}

resource "aws_iam_user_policy_attachment" "mcp_admin_power_user" {
  user       = aws_iam_user.mcp_admin.name
  policy_arn = "arn:aws:iam::aws:policy/PowerUserAccess"
}
