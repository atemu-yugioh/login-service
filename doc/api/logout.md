## Đăng xuất (Logout)

- **Method**: `POST`
- **URL**: `/api/v1/auth/logout`
- **Mô tả**: Đăng xuất, xóa session hiện tại của user.

### Headers

- `x-api-key` (bắt buộc): API key hợp lệ (vì nằm sau router gốc).
- `x-device-id` (bắt buộc): device đang đăng xuất.
- `x-client-id` (bắt buộc): userId của user.
- Một trong hai:
  - `authorization`: access token hiện tại **hoặc**
  - `x-rtoken-id`: refresh token hiện tại.
- `accept-language` (tùy chọn).

> Endpoint này đi qua middleware `authentication`, nên bắt buộc phải gửi đủ bộ header auth như trên.

### Request body

- Không yêu cầu body.

### Response thành công

```json
{
  "status": 200,
  "message": "Success",
  "timestamp": 1700000000000,
  "data": true
}
```

`data` là kết quả từ `sessionRepo.deleteById`, thường là `true`/`1` (xóa thành công).

### Response lỗi (ví dụ)

- Thiếu/invalid token, session không tồn tại, user không tồn tại… sẽ trả về lỗi 401/400 tương ứng với message từ `AuthFailError` hoặc `BadRequestError`.

