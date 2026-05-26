IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
CREATE TABLE [Banners] (
    [Id] uniqueidentifier NOT NULL DEFAULT (NEWID()),
    [Title] nvarchar(max) NOT NULL,
    [ImageUrl] nvarchar(max) NOT NULL,
    [Type] nvarchar(max) NULL,
    [LinkTo] nvarchar(max) NULL,
    [IsActive] bit NOT NULL,
    [Created] datetime2 NOT NULL,
    [CreatedBy] uniqueidentifier NULL,
    [Modified] datetime2 NOT NULL,
    [ModifiedBy] uniqueidentifier NULL,
    [IsDeleted] bit NOT NULL,
    CONSTRAINT [PK_Banners] PRIMARY KEY ([Id])
);

CREATE TABLE [Users] (
    [Id] uniqueidentifier NOT NULL DEFAULT (NEWID()),
    [Username] nvarchar(50) NULL,
    [Email] nvarchar(100) NOT NULL,
    [PasswordHash] nvarchar(255) NOT NULL,
    [FullName] nvarchar(255) NULL,
    [Phone] nvarchar(20) NOT NULL,
    [Avatar] nvarchar(255) NULL,
    [Role] nvarchar(20) NOT NULL,
    [IsLocked] bit NOT NULL,
    [Created] datetime2 NOT NULL,
    [CreatedBy] uniqueidentifier NULL,
    [Modified] datetime2 NOT NULL,
    [ModifiedBy] uniqueidentifier NULL,
    [IsDeleted] bit NOT NULL,
    CONSTRAINT [PK_Users] PRIMARY KEY ([Id])
);

CREATE TABLE [Addresses] (
    [Id] uniqueidentifier NOT NULL DEFAULT (NEWID()),
    [AddressDetail] nvarchar(255) NOT NULL,
    [City] nvarchar(100) NOT NULL,
    [Province] nvarchar(100) NOT NULL,
    [IsDefault] bit NOT NULL,
    [FullName] nvarchar(100) NOT NULL,
    [PhoneNumber] nvarchar(20) NOT NULL,
    [UserId] uniqueidentifier NOT NULL,
    [Created] datetime2 NOT NULL,
    [CreatedBy] uniqueidentifier NULL,
    [Modified] datetime2 NOT NULL,
    [ModifiedBy] uniqueidentifier NULL,
    [IsDeleted] bit NOT NULL,
    CONSTRAINT [PK_Addresses] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Addresses_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [Categories] (
    [Id] uniqueidentifier NOT NULL DEFAULT (NEWID()),
    [Name] nvarchar(max) NOT NULL,
    [Description] nvarchar(max) NULL,
    [ImageUrl] nvarchar(max) NULL,
    [ParentCategoryId] uniqueidentifier NULL,
    [SellerId] uniqueidentifier NULL,
    [Created] datetime2 NOT NULL,
    [CreatedBy] uniqueidentifier NULL,
    [Modified] datetime2 NOT NULL,
    [ModifiedBy] uniqueidentifier NULL,
    [IsDeleted] bit NOT NULL,
    CONSTRAINT [PK_Categories] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Categories_Categories_ParentCategoryId] FOREIGN KEY ([ParentCategoryId]) REFERENCES [Categories] ([Id]),
    CONSTRAINT [FK_Categories_Users_SellerId] FOREIGN KEY ([SellerId]) REFERENCES [Users] ([Id])
);

CREATE TABLE [Payments] (
    [Id] uniqueidentifier NOT NULL DEFAULT (NEWID()),
    [OrderId] uniqueidentifier NOT NULL,
    [UserId] uniqueidentifier NOT NULL,
    [Amount] decimal(18,2) NOT NULL,
    [TxnRef] nvarchar(max) NOT NULL,
    [Status] int NOT NULL,
    [Created] datetime2 NOT NULL,
    [CreatedBy] uniqueidentifier NULL,
    [Modified] datetime2 NOT NULL,
    [ModifiedBy] uniqueidentifier NULL,
    [IsDeleted] bit NOT NULL,
    CONSTRAINT [PK_Payments] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Payments_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [Promotions] (
    [Id] uniqueidentifier NOT NULL DEFAULT (NEWID()),
    [UserId] uniqueidentifier NOT NULL,
    [Code] nvarchar(50) NOT NULL,
    [Description] nvarchar(max) NOT NULL,
    [DiscountPercent] decimal(5,2) NOT NULL,
    [MinOrderValue] decimal(18,2) NULL,
    [QuantityLimit] int NULL,
    [UsedQuantity] int NOT NULL,
    [StartDate] datetime2 NOT NULL,
    [EndDate] datetime2 NOT NULL,
    [Status] nvarchar(20) NOT NULL,
    [Created] datetime2 NOT NULL,
    [CreatedBy] uniqueidentifier NULL,
    [Modified] datetime2 NOT NULL,
    [ModifiedBy] uniqueidentifier NULL,
    [IsDeleted] bit NOT NULL,
    CONSTRAINT [PK_Promotions] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Promotions_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE NO ACTION
);

CREATE TABLE [Reports] (
    [Id] uniqueidentifier NOT NULL DEFAULT (NEWID()),
    [ReporterId] uniqueidentifier NOT NULL,
    [ReportedType] nvarchar(20) NOT NULL,
    [ReportedId] uniqueidentifier NOT NULL,
    [Reason] nvarchar(max) NOT NULL,
    [Status] nvarchar(20) NOT NULL,
    [Created] datetime2 NOT NULL,
    [CreatedBy] uniqueidentifier NULL,
    [Modified] datetime2 NOT NULL,
    [ModifiedBy] uniqueidentifier NULL,
    [IsDeleted] bit NOT NULL,
    CONSTRAINT [PK_Reports] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Reports_Users_ReporterId] FOREIGN KEY ([ReporterId]) REFERENCES [Users] ([Id]) ON DELETE NO ACTION
);

CREATE TABLE [Orders] (
    [Id] uniqueidentifier NOT NULL DEFAULT (NEWID()),
    [UserId] uniqueidentifier NOT NULL,
    [AddressId] uniqueidentifier NULL,
    [PromotionCode] nvarchar(20) NULL,
    [TotalAmount] decimal(18,2) NOT NULL,
    [PaymentMethod] nvarchar(50) NOT NULL,
    [TxnRef] nvarchar(max) NULL,
    [PaymentStatus] int NOT NULL,
    [Created] datetime2 NOT NULL,
    [CreatedBy] uniqueidentifier NULL,
    [Modified] datetime2 NOT NULL,
    [ModifiedBy] uniqueidentifier NULL,
    [IsDeleted] bit NOT NULL,
    CONSTRAINT [PK_Orders] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Orders_Addresses_AddressId] FOREIGN KEY ([AddressId]) REFERENCES [Addresses] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_Orders_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE NO ACTION
);

CREATE TABLE [Products] (
    [Id] uniqueidentifier NOT NULL DEFAULT (NEWID()),
    [SellerId] uniqueidentifier NOT NULL,
    [ProductName] nvarchar(255) NOT NULL,
    [Description] nvarchar(max) NOT NULL,
    [Price] decimal(18,2) NOT NULL,
    [StockQuantity] int NOT NULL,
    [IsActive] bit NOT NULL,
    [SellerStatus] bit NOT NULL,
    [Thumbnail] nvarchar(255) NOT NULL,
    [ImageListJson] nvarchar(255) NULL,
    [CategoryId] uniqueidentifier NULL,
    [Created] datetime2 NOT NULL,
    [CreatedBy] uniqueidentifier NULL,
    [Modified] datetime2 NOT NULL,
    [ModifiedBy] uniqueidentifier NULL,
    [IsDeleted] bit NOT NULL,
    CONSTRAINT [PK_Products] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Products_Categories_CategoryId] FOREIGN KEY ([CategoryId]) REFERENCES [Categories] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_Products_Users_SellerId] FOREIGN KEY ([SellerId]) REFERENCES [Users] ([Id]) ON DELETE NO ACTION
);

CREATE TABLE [ProductVariants] (
    [Id] uniqueidentifier NOT NULL DEFAULT (NEWID()),
    [ProductId] uniqueidentifier NOT NULL,
    [VariantName] nvarchar(100) NOT NULL,
    [VariantValue] nvarchar(100) NOT NULL,
    [Price] decimal(18,2) NOT NULL,
    [StockQuantity] int NOT NULL,
    [ImageUrl] nvarchar(500) NULL,
    [CreatedAt] datetime2 NULL,
    [Created] datetime2 NOT NULL,
    [CreatedBy] uniqueidentifier NULL,
    [Modified] datetime2 NOT NULL,
    [ModifiedBy] uniqueidentifier NULL,
    [IsDeleted] bit NOT NULL,
    CONSTRAINT [PK_ProductVariants] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_ProductVariants_Products_ProductId] FOREIGN KEY ([ProductId]) REFERENCES [Products] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [Reviews] (
    [Id] uniqueidentifier NOT NULL DEFAULT (NEWID()),
    [UserId] uniqueidentifier NOT NULL,
    [ProductId] uniqueidentifier NOT NULL,
    [Rating] int NOT NULL,
    [Comment] nvarchar(max) NOT NULL,
    [Created] datetime2 NOT NULL,
    [CreatedBy] uniqueidentifier NULL,
    [Modified] datetime2 NOT NULL,
    [ModifiedBy] uniqueidentifier NULL,
    [IsDeleted] bit NOT NULL,
    CONSTRAINT [PK_Reviews] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Reviews_Products_ProductId] FOREIGN KEY ([ProductId]) REFERENCES [Products] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Reviews_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE NO ACTION
);

CREATE TABLE [CartItems] (
    [Id] uniqueidentifier NOT NULL DEFAULT (NEWID()),
    [UserId] uniqueidentifier NOT NULL,
    [ProductId] uniqueidentifier NOT NULL,
    [ProductVariantId] uniqueidentifier NULL,
    [Quantity] int NOT NULL,
    [IsSelected] bit NOT NULL,
    [Created] datetime2 NOT NULL,
    [CreatedBy] uniqueidentifier NULL,
    [Modified] datetime2 NOT NULL,
    [ModifiedBy] uniqueidentifier NULL,
    [IsDeleted] bit NOT NULL,
    CONSTRAINT [PK_CartItems] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_CartItems_ProductVariants_ProductVariantId] FOREIGN KEY ([ProductVariantId]) REFERENCES [ProductVariants] ([Id]),
    CONSTRAINT [FK_CartItems_Products_ProductId] FOREIGN KEY ([ProductId]) REFERENCES [Products] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_CartItems_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE NO ACTION
);

CREATE TABLE [OrderItems] (
    [Id] uniqueidentifier NOT NULL DEFAULT (NEWID()),
    [OrderId] uniqueidentifier NOT NULL,
    [ProductId] uniqueidentifier NOT NULL,
    [VariantId] uniqueidentifier NULL,
    [Quantity] int NOT NULL,
    [Price] decimal(18,2) NOT NULL,
    [Created] datetime2 NOT NULL,
    [CreatedBy] uniqueidentifier NULL,
    [Modified] datetime2 NOT NULL,
    [ModifiedBy] uniqueidentifier NULL,
    [IsDeleted] bit NOT NULL,
    CONSTRAINT [PK_OrderItems] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_OrderItems_Orders_OrderId] FOREIGN KEY ([OrderId]) REFERENCES [Orders] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_OrderItems_ProductVariants_VariantId] FOREIGN KEY ([VariantId]) REFERENCES [ProductVariants] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_OrderItems_Products_ProductId] FOREIGN KEY ([ProductId]) REFERENCES [Products] ([Id]) ON DELETE NO ACTION
);

CREATE INDEX [IX_Addresses_UserId] ON [Addresses] ([UserId]);

CREATE INDEX [IX_CartItems_ProductId] ON [CartItems] ([ProductId]);

CREATE INDEX [IX_CartItems_ProductVariantId] ON [CartItems] ([ProductVariantId]);

CREATE INDEX [IX_CartItems_UserId] ON [CartItems] ([UserId]);

CREATE INDEX [IX_Categories_ParentCategoryId] ON [Categories] ([ParentCategoryId]);

CREATE INDEX [IX_Categories_SellerId] ON [Categories] ([SellerId]);

CREATE INDEX [IX_OrderItems_OrderId] ON [OrderItems] ([OrderId]);

CREATE INDEX [IX_OrderItems_ProductId] ON [OrderItems] ([ProductId]);

CREATE INDEX [IX_OrderItems_VariantId] ON [OrderItems] ([VariantId]);

CREATE INDEX [IX_Orders_AddressId] ON [Orders] ([AddressId]);

CREATE INDEX [IX_Orders_UserId] ON [Orders] ([UserId]);

CREATE INDEX [IX_Payments_UserId] ON [Payments] ([UserId]);

CREATE INDEX [IX_Products_CategoryId] ON [Products] ([CategoryId]);

CREATE INDEX [IX_Products_SellerId] ON [Products] ([SellerId]);

CREATE INDEX [IX_ProductVariants_ProductId] ON [ProductVariants] ([ProductId]);

CREATE INDEX [IX_Promotions_UserId] ON [Promotions] ([UserId]);

CREATE INDEX [IX_Reports_ReporterId] ON [Reports] ([ReporterId]);

CREATE INDEX [IX_Reviews_ProductId] ON [Reviews] ([ProductId]);

CREATE INDEX [IX_Reviews_UserId] ON [Reviews] ([UserId]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260226072449_InitialCreate', N'9.0.6');

COMMIT;
GO

