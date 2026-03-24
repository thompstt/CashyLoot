# CashyLoot Terraform Import Guide

Run these commands after `terraform init` to import existing AWS resources into Terraform state.

## Prerequisites

1. Bootstrap completed: `cd infra/bootstrap && terraform init && terraform apply`
2. Main config initialized: `cd infra && terraform init`
3. `terraform.tfvars` created with real values (see `terraform.tfvars.example`)

## Import Commands

### Networking

```bash
# VPC
terraform import module.networking.aws_vpc.main vpc-0b0c62d265b214286

# Security group
terraform import module.networking.aws_security_group.db sg-0b0cd6b0dc3f8c1ae
```

### Database

```bash
# Aurora cluster
terraform import module.database.aws_rds_cluster.main cashylootdb

# Aurora instance
terraform import module.database.aws_rds_cluster_instance.main cashylootdb-instance-1

# DB subnet group
terraform import module.database.aws_db_subnet_group.main default-vpc-0b0c62d265b214286

# Secrets Manager (metadata only)
terraform import module.database.aws_secretsmanager_secret.db_credentials arn:aws:secretsmanager:us-east-1:743984979535:secret:rds!cluster-5a522564-908c-464c-8c38-7cf3d27fedaa-r8UF08

# Enhanced Monitoring role
terraform import module.database.aws_iam_role.rds_monitoring rds-monitoring-role

# Monitoring role policy attachment
terraform import module.database.aws_iam_role_policy_attachment.rds_monitoring rds-monitoring-role/arn:aws:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole
```

### Email (SES)

```bash
# SES domain identity
terraform import module.email.aws_ses_domain_identity.main cashyloot.com

# SES DKIM
terraform import module.email.aws_ses_domain_dkim.main cashyloot.com
```

### DNS (Route 53)

```bash
# Hosted zone
terraform import module.dns.aws_route53_zone.main Z07612133IG2KQ7BSP2MD

# DKIM CNAME records
terraform import 'module.dns.aws_route53_record.dkim[0]' Z07612133IG2KQ7BSP2MD_iwpgcw6sy63fxavk4dy7nv25qk7rwd53._domainkey.cashyloot.com_CNAME
terraform import 'module.dns.aws_route53_record.dkim[1]' Z07612133IG2KQ7BSP2MD_hoy45c53l5k2rjomx5x4esqvgw246bz7._domainkey.cashyloot.com_CNAME
terraform import 'module.dns.aws_route53_record.dkim[2]' Z07612133IG2KQ7BSP2MD_lybou2katocerimgtvfjmzrpsiuwsqdp._domainkey.cashyloot.com_CNAME
```

### IAM

```bash
# Amplify SSR role
terraform import module.iam.aws_iam_role.amplify_ssr AmplifySSRLoggingRole-3799087d-e89d-44dc-8621-8c6ba974ea4d

# SES inline policy (format: role_name:policy_name)
terraform import 'module.iam.aws_iam_role_policy.ses_send' AmplifySSRLoggingRole-3799087d-e89d-44dc-8621-8c6ba974ea4d:SES-SendEmail

# mcp-admin user
terraform import module.iam.aws_iam_user.mcp_admin mcp-admin

# mcp-admin policy attachment (format: username/policy-arn)
terraform import module.iam.aws_iam_user_policy_attachment.mcp_admin_power_user mcp-admin/arn:aws:iam::aws:policy/PowerUserAccess
```

## Post-Import Validation

1. Run `terraform plan`
2. Expected changes: tag additions (`Project`, `ManagedBy`, `Environment`) — these are intentional
3. For any other changes: update HCL to match actual resource state
4. Run `terraform apply` to apply tag additions
5. Run `terraform plan` again — should show no changes
