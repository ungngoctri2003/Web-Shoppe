/*
  Shopee - Seed data mẫu
  =======================
  Chạy SAU KHI đã tạo schema (init-only.sql) trên database Shopee.

  Tài khoản đăng nhập (mật khẩu tất cả: 123456):
    Admin  -> admin@shopee.local
    Seller -> seller@shopee.local
    User   -> user@shopee.local

  Mã giảm giá: SHOPEE10 (giảm 10%)
*/

USE [Shopee];
GO

SET NOCOUNT ON;

-- Xóa dữ liệu seed cũ (nếu chạy lại)
DELETE FROM [Reviews]       WHERE [Id] IN (
    'E0010001-0000-0000-0000-000000000001',
    'E0010002-0000-0000-0000-000000000002'
);
DELETE FROM [CartItems]     WHERE [UserId] = '33333333-3333-3333-3333-333333333333';
DELETE FROM [OrderItems]    WHERE [OrderId] = 'F0010001-0000-0000-0000-000000000001';
DELETE FROM [Orders]        WHERE [Id] = 'F0010001-0000-0000-0000-000000000001';
DELETE FROM [ProductVariants] WHERE [ProductId] IN (
    'D0010001-0000-0000-0000-000000000001',
    'D0010002-0000-0000-0000-000000000002',
    'D0010003-0000-0000-0000-000000000003',
    'D0010004-0000-0000-0000-000000000004',
    'D0010005-0000-0000-0000-000000000005',
    'D0010006-0000-0000-0000-000000000006'
);
DELETE FROM [Products]      WHERE [Id] IN (
    'D0010001-0000-0000-0000-000000000001',
    'D0010002-0000-0000-0000-000000000002',
    'D0010003-0000-0000-0000-000000000003',
    'D0010004-0000-0000-0000-000000000004',
    'D0010005-0000-0000-0000-000000000005',
    'D0010006-0000-0000-0000-000000000006'
);
DELETE FROM [Banners]       WHERE [Id] IN (
    'B0010001-0000-0000-0000-000000000001',
    'B0010002-0000-0000-0000-000000000002',
    'B0010003-0000-0000-0000-000000000003',
    'B0010004-0000-0000-0000-000000000004'
);
DELETE FROM [Promotions]    WHERE [Id] = 'C0010001-0000-0000-0000-000000000001';
DELETE FROM [Categories]    WHERE [Id] IN (
    'A0010001-0000-0000-0000-000000000001',
    'A0010002-0000-0000-0000-000000000002',
    'A0010003-0000-0000-0000-000000000003'
);
DELETE FROM [Addresses]     WHERE [Id] = '44444444-4444-4444-4444-444444444444';
DELETE FROM [Users]         WHERE [Id] IN (
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    '33333333-3333-3333-3333-333333333333'
);
GO

BEGIN TRANSACTION;

DECLARE @Now datetime2 = SYSUTCDATETIME();
DECLARE @PwdHash nvarchar(255) = N'$2a$11$AbjJvGqU7.0fbWzZA3B8au/a7WVSRfPtSPYuhsKsFYOIbTNkjSHcK';

-- ===================== USERS =====================
INSERT INTO [Users] ([Id], [Username], [Email], [PasswordHash], [FullName], [Phone], [Avatar], [Role], [IsLocked], [Created], [Modified], [IsDeleted])
VALUES
('11111111-1111-1111-1111-111111111111', N'admin',   N'admin@shopee.local',  @PwdHash, N'Quản trị viên',  N'0901000001', NULL, N'Admin',  0, @Now, @Now, 0),
('22222222-2222-2222-2222-222222222222', N'seller1', N'seller@shopee.local', @PwdHash, N'Cửa hàng Demo',  N'0902000002', NULL, N'Seller', 0, @Now, @Now, 0),
('33333333-3333-3333-3333-333333333333', N'user1',   N'user@shopee.local',   @PwdHash, N'Nguyễn Văn A',   N'0903000003', NULL, N'User',   0, @Now, @Now, 0);

-- ===================== ADDRESS =====================
INSERT INTO [Addresses] ([Id], [AddressDetail], [City], [Province], [IsDefault], [FullName], [PhoneNumber], [UserId], [Created], [Modified], [IsDeleted])
VALUES
('44444444-4444-4444-4444-444444444444', N'123 Nguyễn Huệ', N'Quận 1', N'TP. Hồ Chí Minh', 1, N'Nguyễn Văn A', N'0903000003', '33333333-3333-3333-3333-333333333333', @Now, @Now, 0);

-- ===================== CATEGORIES =====================
INSERT INTO [Categories] ([Id], [Name], [Description], [ImageUrl], [ParentCategoryId], [SellerId], [Created], [Modified], [IsDeleted])
VALUES
('A0010001-0000-0000-0000-000000000001', N'Điện thoại & Phụ kiện', N'Thiết bị di động và phụ kiện', N'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400', NULL, '22222222-2222-2222-2222-222222222222', @Now, @Now, 0),
('A0010002-0000-0000-0000-000000000002', N'Thời trang Nam',         N'Quần áo, giày dép nam',        N'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400', NULL, '22222222-2222-2222-2222-222222222222', @Now, @Now, 0),
('A0010003-0000-0000-0000-000000000003', N'Đồ gia dụng',            N'Đồ dùng nhà bếp, nội thất',    N'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400', NULL, '22222222-2222-2222-2222-222222222222', @Now, @Now, 0);

-- ===================== PRODUCTS =====================
INSERT INTO [Products] ([Id], [SellerId], [ProductName], [Description], [Price], [StockQuantity], [IsActive], [SellerStatus], [Thumbnail], [ImageListJson], [CategoryId], [Created], [Modified], [IsDeleted])
VALUES
('D0010001-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', N'iPhone 15 128GB', N'iPhone 15 chính hãng VN/A, bảo hành 12 tháng.', 18990000, 50, 1, 1, N'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600', N'["https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600"]', 'A0010001-0000-0000-0000-000000000001', @Now, @Now, 0),
('D0010002-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', N'Samsung Galaxy S24', N'Galaxy S24 256GB, camera AI, pin trâu.', 17990000, 35, 1, 1, N'https://images.unsplash.com/photo-1610945265064-0e34e55182fa?w=600', N'["https://images.unsplash.com/photo-1610945265064-0e34e55182fa?w=600"]', 'A0010001-0000-0000-0000-000000000001', @Now, @Now, 0),
('D0010003-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222', N'Tai nghe Bluetooth Pro', N'Tai nghe chống ồn chủ động, pin 30 giờ.', 890000, 120, 1, 1, N'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600', N'["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600"]', 'A0010001-0000-0000-0000-000000000001', @Now, @Now, 0),
('D0010004-0000-0000-0000-000000000004', '22222222-2222-2222-2222-222222222222', N'Áo thun nam basic cotton', N'Áo thun 100% cotton, form regular.', 99000, 200, 1, 1, N'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600', N'["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600"]', 'A0010002-0000-0000-0000-000000000002', @Now, @Now, 0),
('D0010005-0000-0000-0000-000000000005', '22222222-2222-2222-2222-222222222222', N'Giày sneaker nam', N'Giày thể thao đế cao su, thoáng khí.', 450000, 80, 1, 1, N'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600', N'["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"]', 'A0010002-0000-0000-0000-000000000002', @Now, @Now, 0),
('D0010006-0000-0000-0000-000000000006', '22222222-2222-2222-2222-222222222222', N'Nồi cơm điện 1.8L', N'Nồi cơm điện tử, nấu nhanh, tiết kiệm điện.', 750000, 60, 1, 1, N'https://images.unsplash.com/photo-1585515320310-259814833e62?w=600', N'["https://images.unsplash.com/photo-1585515320310-259814833e62?w=600"]', 'A0010003-0000-0000-0000-000000000003', @Now, @Now, 0);

-- ===================== PRODUCT VARIANTS =====================
INSERT INTO [ProductVariants] ([Id], [ProductId], [VariantName], [VariantValue], [Price], [StockQuantity], [ImageUrl], [CreatedAt], [Created], [Modified], [IsDeleted])
VALUES
('D0020001-0000-0000-0000-000000000001', 'D0010001-0000-0000-0000-000000000001', N'Màu sắc', N'Đen',       18990000, 20, NULL, @Now, @Now, @Now, 0),
('D0020002-0000-0000-0000-000000000002', 'D0010001-0000-0000-0000-000000000001', N'Màu sắc', N'Xanh',      18990000, 15, NULL, @Now, @Now, @Now, 0),
('D0020003-0000-0000-0000-000000000003', 'D0010004-0000-0000-0000-000000000004', N'Size',    N'M',         99000,    80, NULL, @Now, @Now, @Now, 0),
('D0020004-0000-0000-0000-000000000004', 'D0010004-0000-0000-0000-000000000004', N'Size',    N'L',         99000,    70, NULL, @Now, @Now, @Now, 0),
('D0020005-0000-0000-0000-000000000005', 'D0010005-0000-0000-0000-000000000005', N'Size',    N'42',        450000,   30, NULL, @Now, @Now, @Now, 0),
('D0020006-0000-0000-0000-000000000006', 'D0010005-0000-0000-0000-000000000005', N'Size',    N'43',        450000,   25, NULL, @Now, @Now, @Now, 0);

-- ===================== BANNERS (trang chủ FE) =====================
INSERT INTO [Banners] ([Id], [Title], [ImageUrl], [Type], [LinkTo], [IsActive], [Created], [Modified], [IsDeleted])
VALUES
('B0010001-0000-0000-0000-000000000001', N'Banner trang chủ chính', N'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200', N'homepage',     N'/', 1, @Now, @Now, 0),
('B0010002-0000-0000-0000-000000000002', N'Siêu sale cuối tuần',   N'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=1200', N'Top Banner',   N'/', 1, @Now, @Now, 0),
('B0010003-0000-0000-0000-000000000003', N'Freeship toàn quốc',     N'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200', N'Top Banner 1', N'/', 1, @Now, @Now, 0);

-- Thêm banner slider phụ
INSERT INTO [Banners] ([Id], [Title], [ImageUrl], [Type], [LinkTo], [IsActive], [Created], [Modified], [IsDeleted])
VALUES
('B0010004-0000-0000-0000-000000000004', N'Điện thoại hot', N'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200', N'homepage', N'/', 1, @Now, @Now, 0);

-- ===================== PROMOTIONS =====================
INSERT INTO [Promotions] ([Id], [UserId], [Code], [Description], [DiscountPercent], [MinOrderValue], [QuantityLimit], [UsedQuantity], [StartDate], [EndDate], [Status], [Created], [Modified], [IsDeleted])
VALUES
('C0010001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', N'SHOPEE10', N'Giảm 10% cho đơn từ 200.000đ', 10.00, 200000, 1000, 0, DATEADD(DAY, -30, @Now), DATEADD(DAY, 365, @Now), N'Active', @Now, @Now, 0);

-- ===================== REVIEWS =====================
INSERT INTO [Reviews] ([Id], [UserId], [ProductId], [Rating], [Comment], [Created], [Modified], [IsDeleted])
VALUES
('E0010001-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333333', 'D0010001-0000-0000-0000-000000000001', 5, N'Sản phẩm đẹp, giao hàng nhanh!', @Now, @Now, 0),
('E0010002-0000-0000-0000-000000000002', '33333333-3333-3333-3333-333333333333', 'D0010003-0000-0000-0000-000000000003', 4, N'Âm thanh tốt, pin ổn.', @Now, @Now, 0);

COMMIT TRANSACTION;
GO

PRINT N'✓ Seed data đã import thành công.';
PRINT N'  Admin  : admin@shopee.local  / 123456';
PRINT N'  Seller : seller@shopee.local / 123456';
PRINT N'  User   : user@shopee.local   / 123456';
PRINT N'  Mã KM  : SHOPEE10';
GO
