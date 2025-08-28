# Hướng dẫn sử dụng bộ template tài liệu dự án

## 1. Mục đích
Bộ template này giúp xây dựng, duy trì và mở rộng tài liệu cho bất kỳ dự án nào (phần mềm, nghiên cứu, sản xuất...), đảm bảo cấu trúc rõ ràng, dễ đọc, dễ mở rộng cho AI và con người.

## 2. Cấu trúc thư mục mẫu

```
docs_template/
├── 00_context/           # Nền tảng kỹ thuật, yêu cầu nghiệp vụ, kiến trúc
│   ├── requirements.md   # Yêu cầu nghiệp vụ, phạm vi, tiêu chí thành công
│   ├── implementation-guide.md # Hướng dẫn triển khai, kiến trúc, công nghệ
├── 01_plan/              # Quản lý tiến độ, roadmap, milestone
│   └── project-roadmap.md
├── 02_implement/         # Ghi chú quá trình phát triển, kiểm thử, hoàn thiện
│   └── sprint-01.md      # Template ghi chú sprint (có thể nhân bản cho nhiều sprint)
```

## 3. Quy trình tạo tài liệu

1. **Bắt đầu dự án**: Copy toàn bộ docs_template vào thư mục dự án, đổi tên thành docs.
2. **Điền thông tin**: Sử dụng các file mẫu, điền thông tin thực tế của dự án vào từng phần.
3. **Cập nhật liên tục**: Mỗi khi có thay đổi về yêu cầu, tiến độ, hoặc kết quả thực hiện, cập nhật vào file tương ứng.
4. **Tuân thủ quy tắc duy trì**: Không lặp lại thông tin, luôn link tới nguồn gốc, ghi chú trạng thái rõ ràng, phân biệt overview và chi tiết.

## 4. Vai trò từng nhóm tài liệu

- **00_context/**: Định nghĩa nền tảng, yêu cầu, kiến trúc, tiêu chuẩn kỹ thuật.
- **01_plan/**: Theo dõi tiến độ, milestone, roadmap, tiêu chí hoàn thành.
- **02_implement/**: Ghi lại quá trình thực hiện, kiểm thử, kết quả từng sprint/task.

## 5. Hướng dẫn cho AI

- Khi cần tạo tài liệu mới, AI sẽ dựa vào template này để sinh nội dung cho từng file, đảm bảo đúng cấu trúc và logic.
- Khi cần mở rộng, AI sẽ nhân bản file sprint-x.md cho từng sprint/task mới.
- Khi cần review, AI sẽ kiểm tra trạng thái, liên kết, và tính nhất quán giữa các file.

## 6. Mẫu nội dung cho từng file: xem các file trong từng thư mục để sử dụng.
