terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Import existing default VPC — do not recreate
resource "aws_vpc" "main" {
  cidr_block           = "172.31.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true
}

# NOTE: Subnets and VPC flow logs are deferred to a follow-up task.
# Subnets are managed by AWS for the default VPC and rarely need Terraform control.
# Flow logs should be verified with:
#   aws ec2 describe-flow-logs --filter "Name=resource-id,Values=vpc-0b0c62d265b214286"
# Then imported or created as needed.

# Import existing security group used by RDS
resource "aws_security_group" "db" {
  name        = "default"
  description = "default VPC security group"
  vpc_id      = aws_vpc.main.id

  # WARNING: 0.0.0.0/0 on port 5432 — tighten when Amplify IP ranges are known
  # TODO: Restrict to Amplify VPC endpoints or specific CIDR blocks
  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port = 0
    to_port   = 0
    protocol  = "-1"
    self      = true
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
