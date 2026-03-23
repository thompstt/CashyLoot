terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

resource "aws_rds_cluster" "main" {
  cluster_identifier = var.cluster_identifier
  engine             = "aurora-postgresql"
  engine_mode        = "provisioned"
  engine_version     = "17.4"

  master_username                     = "CashyLoot"
  manage_master_user_password         = true
  deletion_protection                 = var.deletion_protection
  skip_final_snapshot                 = false
  final_snapshot_identifier           = "${var.cluster_identifier}-final"
  backup_retention_period             = var.backup_retention_period
  preferred_backup_window             = "04:12-04:42"
  preferred_maintenance_window        = "wed:05:45-wed:06:15"
  copy_tags_to_snapshot               = true
  storage_encrypted                   = false  # TODO: Enable (requires cluster recreation — Phase 4)
  iam_database_authentication_enabled = false   # TODO: Enable for IAM auth — Phase 4

  db_subnet_group_name   = var.subnet_group_name
  vpc_security_group_ids = [var.security_group_id]

  serverlessv2_scaling_configuration {
    min_capacity = var.min_capacity
    max_capacity = var.max_capacity
  }

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_rds_cluster_instance" "main" {
  identifier         = var.instance_identifier
  cluster_identifier = aws_rds_cluster.main.id
  instance_class     = "db.serverless"
  engine             = aws_rds_cluster.main.engine
  engine_version     = aws_rds_cluster.main.engine_version
  promotion_tier     = 1

  monitoring_interval    = 60
  monitoring_role_arn    = aws_iam_role.rds_monitoring.arn
  publicly_accessible    = true  # TODO: Set to false when VPC connectivity is configured
  auto_minor_version_upgrade = true
}

resource "aws_db_subnet_group" "main" {
  name       = var.subnet_group_name
  subnet_ids = data.aws_subnets.default.ids
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

data "aws_vpc" "default" {
  default = true
}

# Secrets Manager — metadata only (password not managed by Terraform)
# The actual credential values (secret version) are NOT managed by Terraform.
# Password rotation happens outside Terraform.
resource "aws_secretsmanager_secret" "db_credentials" {
  name = "rds!cluster-5a522564-908c-464c-8c38-7cf3d27fedaa"

  lifecycle {
    ignore_changes = [name, description]
  }
}

# Enhanced Monitoring IAM Role
resource "aws_iam_role" "rds_monitoring" {
  name = "rds-monitoring-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "monitoring.rds.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "rds_monitoring" {
  role       = aws_iam_role.rds_monitoring.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole"
}
