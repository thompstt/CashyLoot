terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

resource "aws_amplify_app" "main" {
  name       = var.app_name
  repository = var.repository_url
  platform   = "WEB_COMPUTE"

  iam_service_role_arn = var.iam_service_role_arn

  build_spec = var.build_spec

  # Redirect apex to www
  custom_rule {
    source = "https://${var.domain_name}"
    target = "https://www.${var.domain_name}"
    status = "302"
  }

  # SPA fallback
  custom_rule {
    source = "/<*>"
    target = "/index.html"
    status = "404-200"
  }

  # WAF is managed by Amplify — not imported into Terraform
  # See Phase 2 design decision: let Amplify handle WAF lifecycle
  lifecycle {
    ignore_changes = [
      # Amplify may update these outside Terraform
      auto_branch_creation_config,
      auto_branch_creation_patterns,
      enable_auto_branch_creation,
    ]
  }
}

resource "aws_amplify_branch" "main" {
  app_id      = aws_amplify_app.main.id
  branch_name = "main"
  stage       = "PRODUCTION"
  framework   = "Next.js - SSR"

  enable_auto_build = true

  # Branch-level env vars contain secrets — managed via Amplify Console, not Terraform
  # Terraform tracks the branch config but ignores env var changes
  lifecycle {
    ignore_changes = [environment_variables]
  }
}

resource "aws_amplify_domain_association" "main" {
  app_id      = aws_amplify_app.main.id
  domain_name = var.domain_name

  sub_domain {
    branch_name = aws_amplify_branch.main.branch_name
    prefix      = ""
  }

  sub_domain {
    branch_name = aws_amplify_branch.main.branch_name
    prefix      = "www"
  }
}
