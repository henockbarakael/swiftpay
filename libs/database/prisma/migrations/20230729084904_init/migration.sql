-- CreateTable
CREATE TABLE `permissions` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `permissions_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `role_permissions` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `permissionId` VARCHAR(191) NOT NULL,
    `roleId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `role_permissions_slug_key`(`slug`),
    UNIQUE INDEX `role_permissions_roleId_permissionId_key`(`roleId`, `permissionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `permissionId` INTEGER NOT NULL,

    UNIQUE INDEX `roles_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_roles` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `roleId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `user_roles_slug_key`(`slug`),
    UNIQUE INDEX `user_roles_userId_roleId_key`(`userId`, `roleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NULL,
    `lastName` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `hashedPassword` VARCHAR(191) NOT NULL,
    `salt` VARCHAR(191) NULL,
    `birthDate` DATETIME(3) NULL,
    `gender` VARCHAR(191) NOT NULL DEFAULT 'M',
    `address` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `state` VARCHAR(191) NULL,
    `country` VARCHAR(191) NULL,
    `imageUrl` VARCHAR(191) NULL,
    `isActive` BOOLEAN NULL DEFAULT false,
    `lastLogin` DATETIME(3) NULL,
    `phone` VARCHAR(191) NULL,
    `NbFailedAttempts` INTEGER NOT NULL DEFAULT 0,
    `temporaryLockedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `marchants` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,
    `institutionId` VARCHAR(191) NOT NULL,
    `accountStatusId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `marchants_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users_support` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `users_support_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transaction` (
    `id` VARCHAR(191) NOT NULL,
    `merchantReference` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `telcoStatus` VARCHAR(191) NOT NULL,
    `telcoStatusDescription` VARCHAR(191) NOT NULL,
    `reference` VARCHAR(191) NOT NULL,
    `telcoReference` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `dailyOperationId` VARCHAR(191) NOT NULL,
    `currencyId` VARCHAR(191) NOT NULL,
    `transactionStatusId` VARCHAR(191) NOT NULL,
    `serviceId` VARCHAR(191) NOT NULL,

    INDEX `transaction_merchantReference_idx`(`merchantReference`),
    INDEX `transaction_reference_idx`(`reference`),
    INDEX `transaction_telcoReference_idx`(`telcoReference`),
    INDEX `transaction_dailyOperationId_idx`(`dailyOperationId`),
    UNIQUE INDEX `transaction_merchantReference_key`(`merchantReference`),
    UNIQUE INDEX `transaction_telcoReference_key`(`telcoReference`),
    UNIQUE INDEX `transaction_reference_key`(`reference`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `daily_operation` (
    `id` VARCHAR(191) NOT NULL,
    `merchantReference` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `telcoStatus` VARCHAR(191) NOT NULL,
    `telcoStatusDescription` VARCHAR(191) NOT NULL,
    `reference` VARCHAR(191) NOT NULL,
    `telcoReference` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `currencyId` VARCHAR(191) NOT NULL,
    `serviceId` VARCHAR(191) NOT NULL,
    `transactionStatusId` VARCHAR(191) NOT NULL,

    INDEX `daily_operation_merchantReference_idx`(`merchantReference`),
    INDEX `daily_operation_reference_idx`(`reference`),
    INDEX `daily_operation_telcoReference_idx`(`telcoReference`),
    UNIQUE INDEX `daily_operation_merchantReference_key`(`merchantReference`),
    UNIQUE INDEX `daily_operation_telcoReference_key`(`telcoReference`),
    UNIQUE INDEX `daily_operation_reference_key`(`reference`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transaction_status` (
    `id` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `currency` (
    `id` VARCHAR(191) NOT NULL,
    `currency` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `institution` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `tel` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `merchant_commission` (
    `id` VARCHAR(191) NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `commission` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,
    `serviceId` VARCHAR(191) NOT NULL,

    INDEX `merchant_commission_serviceId_idx`(`serviceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `service` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `serviceTopic` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `account_status` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `merchant_wallet` (
    `id` VARCHAR(191) NOT NULL,
    `balance` DOUBLE NOT NULL,
    `serviceId` VARCHAR(191) NOT NULL,
    `merchantId` INTEGER NOT NULL,

    INDEX `merchant_wallet_merchantId_idx`(`merchantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `merchant_wallet_history` (
    `id` VARCHAR(191) NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `previousBalance` DOUBLE NOT NULL,
    `actualBalance` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `merchantWalletId` VARCHAR(191) NOT NULL,

    INDEX `merchant_wallet_history_merchantWalletId_idx`(`merchantWalletId`),
    INDEX `merchant_wallet_history_action_idx`(`action`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `merchant_wallet_parameter` (
    `id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `merchantId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `merchant_wallet_parameter_merchantId_key`(`merchantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `agregator_parameter` (
    `id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `blacklist_number` (
    `id` VARCHAR(191) NOT NULL,
    `number` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `audit_log` (
    `id` VARCHAR(191) NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `modifiedTable` VARCHAR(191) NOT NULL,
    `oldValue` VARCHAR(191) NOT NULL,
    `newValue` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `permissions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_roles` ADD CONSTRAINT `user_roles_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_roles` ADD CONSTRAINT `user_roles_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `marchants` ADD CONSTRAINT `marchants_accountStatusId_fkey` FOREIGN KEY (`accountStatusId`) REFERENCES `account_status`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `marchants` ADD CONSTRAINT `marchants_institutionId_fkey` FOREIGN KEY (`institutionId`) REFERENCES `institution`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `marchants` ADD CONSTRAINT `marchants_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users_support` ADD CONSTRAINT `users_support_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaction` ADD CONSTRAINT `transaction_dailyOperationId_fkey` FOREIGN KEY (`dailyOperationId`) REFERENCES `daily_operation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaction` ADD CONSTRAINT `transaction_currencyId_fkey` FOREIGN KEY (`currencyId`) REFERENCES `currency`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaction` ADD CONSTRAINT `transaction_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `service`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaction` ADD CONSTRAINT `transaction_transactionStatusId_fkey` FOREIGN KEY (`transactionStatusId`) REFERENCES `transaction_status`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `daily_operation` ADD CONSTRAINT `daily_operation_currencyId_fkey` FOREIGN KEY (`currencyId`) REFERENCES `currency`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `daily_operation` ADD CONSTRAINT `daily_operation_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `service`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `daily_operation` ADD CONSTRAINT `daily_operation_transactionStatusId_fkey` FOREIGN KEY (`transactionStatusId`) REFERENCES `transaction_status`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `merchant_commission` ADD CONSTRAINT `merchant_commission_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `service`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `merchant_wallet` ADD CONSTRAINT `merchant_wallet_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `service`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `merchant_wallet` ADD CONSTRAINT `merchant_wallet_merchantId_fkey` FOREIGN KEY (`merchantId`) REFERENCES `marchants`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `merchant_wallet_history` ADD CONSTRAINT `merchant_wallet_history_merchantWalletId_fkey` FOREIGN KEY (`merchantWalletId`) REFERENCES `merchant_wallet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `merchant_wallet_parameter` ADD CONSTRAINT `merchant_wallet_parameter_merchantId_fkey` FOREIGN KEY (`merchantId`) REFERENCES `marchants`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `audit_log` ADD CONSTRAINT `audit_log_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
