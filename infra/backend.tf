terraform {
  backend "s3" {
    bucket         = "cashyloot-terraform-state"
    key            = "production/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "cashyloot-terraform-locks"
    encrypt        = true
  }
}
