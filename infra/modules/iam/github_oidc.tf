# GitHub Actions OIDC Provider + Role
# Allows GitHub Actions to authenticate with AWS without long-lived access keys.
# Used by: terraform plan in CI (Phase 3)

data "aws_caller_identity" "current" {}

resource "aws_iam_openid_connect_provider" "github" {
  url = "https://token.actions.githubusercontent.com"

  client_id_list = ["sts.amazonaws.com"]

  # GitHub's OIDC thumbprint — required but AWS auto-validates for GitHub
  thumbprint_list = ["ffffffffffffffffffffffffffffffffffffffff"]
}

resource "aws_iam_role" "github_actions" {
  name        = "${var.project_name}-github-actions"
  description = "Role assumed by GitHub Actions via OIDC for Terraform operations"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Federated = aws_iam_openid_connect_provider.github.arn
      }
      Action = "sts:AssumeRoleWithWebIdentity"
      Condition = {
        StringEquals = {
          "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
        }
        StringLike = {
          # Only allow from the CashyLoot repo
          "token.actions.githubusercontent.com:sub" = "repo:${var.github_repo}:*"
        }
      }
    }]
  })

  # Tags ignored until mcp-admin has iam:TagRole permission
  lifecycle {
    ignore_changes = [tags, tags_all]
  }
}

# Read-only permissions for terraform plan
# This role can read all resources but cannot modify anything
resource "aws_iam_role_policy" "github_actions_readonly" {
  name = "TerraformPlanReadOnly"
  role = aws_iam_role.github_actions.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "rds:Describe*",
          "rds:List*",
          "ec2:Describe*",
          "ses:Get*",
          "ses:Describe*",
          "route53:Get*",
          "route53:List*",
          "iam:Get*",
          "iam:List*",
          "secretsmanager:Describe*",
          "secretsmanager:GetResourcePolicy",
          "secretsmanager:List*",
          "amplify:Get*",
          "amplify:List*",
          "s3:Get*",
          "s3:List*",
          "dynamodb:Describe*",
          "dynamodb:Get*",
        ]
        Resource = "*"
      },
      {
        # Allow reading/writing Terraform state
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
        ]
        Resource = "arn:aws:s3:::${var.project_name}-terraform-state/*"
      },
      {
        # Allow state locking
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:DeleteItem",
        ]
        Resource = "arn:aws:dynamodb:*:${data.aws_caller_identity.current.account_id}:table/${var.project_name}-terraform-locks"
      },
    ]
  })
}
