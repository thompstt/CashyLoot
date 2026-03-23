terraform {
  required_version = ">= 1.5.0, < 2.0.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = var.project_name
      ManagedBy   = "terraform"
      Environment = var.environment
    }
  }
}

# ── Modules ──

module "networking" {
  source = "./modules/networking"

  vpc_id            = var.vpc_id
  security_group_id = var.db_security_group_id
}

module "database" {
  source = "./modules/database"

  cluster_identifier      = var.db_cluster_id
  instance_identifier     = "${var.db_cluster_id}-instance-1"
  subnet_group_name       = var.db_subnet_group_name
  security_group_id       = module.networking.db_security_group_id
  min_capacity            = var.db_min_capacity
  max_capacity            = var.db_max_capacity
  deletion_protection     = true
  backup_retention_period = 7
}

module "email" {
  source = "./modules/email"

  domain_name = var.domain_name
}

module "dns" {
  source = "./modules/dns"

  domain_name     = var.domain_name
  hosted_zone_id  = var.hosted_zone_id
  ses_dkim_tokens = module.email.dkim_tokens
}

module "iam" {
  source = "./modules/iam"

  amplify_role_name = var.amplify_role_name
}
