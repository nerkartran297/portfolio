# Câu trả lời cho các câu hỏi về Portfolio

## 1. Flow tạo New Achievement được tạo như thế nào?

### Tổng quan
Khi user tạo một achievement mới, flow hoạt động như sau:

1. **User mở Dialog** → Click button "Create Achievement" trong `AchievementsPage`
2. **Form Validation** → Sử dụng React Hook Form + Zod schema
3. **Submit** → Dispatch Redux action `create()`
4. **Redux Store** → Thêm achievement vào state và lưu vào localStorage
5. **UI Update** → Table tự động cập nhật với achievement mới

### Chi tiết từng bước:

#### Bước 1: Form Setup (`CreateAchievementDialog.tsx`)
```typescript
// Schema validation với Zod
const schema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z.string().max(1000, "Description too long").optional(),
  tags: z.array(z.string().min(1)).max(10, "Too many tags"),
});

// React Hook Form với zodResolver
const { register, handleSubmit, formState: { errors }, setValue, control, reset } = useForm<FormData>({
  resolver: zodResolver(schema),
  defaultValues: { title: "", description: "", tags: [] },
});
```

#### Bước 2: User nhập dữ liệu
- **Title**: TextField bắt buộc, tối đa 200 ký tự
- **Description**: TextField tùy chọn, multiline, tối đa 1000 ký tự
- **Tags**: Autocomplete multiple với freeSolo (cho phép nhập tag mới), tối đa 10 tags

#### Bước 3: Submit Form
```typescript
const onSubmit = (data: FormData) => {
  dispatch(create(data));  // Dispatch Redux action
  toast.success("Achievement created");  // Hiển thị notification
  reset();  // Reset form về trạng thái ban đầu
  onClose();  // Đóng dialog
};
```

#### Bước 4: Redux Action (`achievementsSlice.ts`)
```typescript
create: (state, action: PayloadAction<Omit<Achievement, "id" | "createdAt" | "updatedAt">>) => {
  const newAchievement: Achievement = {
    ...action.payload,  // title, description, tags từ form
    id: crypto.randomUUID(),  // Tự động generate UUID
    createdAt: new Date().toISOString(),  // Timestamp hiện tại
  };
  state.push(newAchievement);  // Thêm vào Redux state
  saveToStorage(state);  // Lưu vào localStorage
}
```

#### Bước 5: Persistence
- **localStorage**: Tất cả achievements được lưu vào `localStorage` với key `"portfolio-achievements"`
- **Auto-sync**: Mỗi khi state thay đổi (create/update/delete), `saveToStorage()` được gọi để đồng bộ

#### Bước 6: UI Update
- `AchievementsTable` component tự động re-render vì nó subscribe vào Redux store qua `useAppSelector`
- Achievement mới xuất hiện trong table ngay lập tức
- Nếu có filter đang active, achievement mới có thể không hiển thị nếu không match filter

### Điểm đặc biệt:
- **Validation**: Zod schema đảm bảo dữ liệu hợp lệ trước khi submit
- **Type Safety**: TypeScript + Zod inference đảm bảo type safety
- **Optimistic Update**: UI update ngay lập tức, không cần chờ server
- **Persistence**: Dữ liệu được lưu local, không mất khi refresh page

---

## 2. Cách UI hoạt động trong phần auto snap của các thông tin liên hệ (Contact section)

### Tổng quan
Contact section có một viewport scrollable với các channel items (Email, LinkedIn, GitHub, etc.). Khi user scroll hoặc dùng wheel, các items sẽ tự động "snap" vào giữa viewport với animation mượt mà.

### Các cơ chế hoạt động:

#### 1. **Wheel Event Handler** (Scroll bằng mouse wheel)
```typescript
const onWheel = (e: WheelEvent) => {
  e.preventDefault();  // Ngăn scroll mặc định
  cancelAnim();  // Hủy animation đang chạy nếu có
  
  if (wheelLockRef.current) return;  // Lock để tránh spam
  wheelLockRef.current = true;
  
  const dir = Math.sign(e.deltaY);  // -1 (up) hoặc 1 (down)
  setActive((prev) => clamp(prev + dir, 0, maxIdx));  // Tăng/giảm active index
  
  // Unlock sau 200ms
  window.setTimeout(() => {
    wheelLockRef.current = false;
  }, 200);
};
```

**Cách hoạt động:**
- Mỗi lần scroll wheel, `active` state thay đổi ±1
- `clamp()` đảm bảo index không vượt quá 0 hoặc maxIdx
- Wheel lock 200ms để tránh scroll quá nhanh

#### 2. **Auto Snap khi active thay đổi**
```typescript
useEffect(() => {
  snapToActive(active);  // Tự động snap khi active thay đổi
}, [active]);

const snapToActive = (index: number) => {
  const item = vp.querySelector<HTMLElement>(`[data-channel="${index}"]`);
  if (!item) return;
  
  // Tính toán vị trí để item nằm giữa viewport
  const vpCenter = vp.scrollTop + vp.clientHeight / 2;
  const itemCenter = item.offsetTop + item.offsetHeight / 2;
  const target = vp.scrollTop + (itemCenter - vpCenter);
  
  // Animate scroll với easing
  animateScrollTo(vp, target, 450);
};
```

**Cách hoạt động:**
- Khi `active` thay đổi, `snapToActive()` được gọi
- Tính toán vị trí scroll để item nằm chính giữa viewport
- Sử dụng `animateScrollTo()` với easing function để scroll mượt

#### 3. **Scroll Detection** (Trackpad/Touch scroll)
```typescript
const onScroll = () => {
  if (snapTimerRef.current) window.clearTimeout(snapTimerRef.current);
  
  snapTimerRef.current = window.setTimeout(() => {
    // Tìm item gần center nhất
    const vpCenter = vp.scrollTop + vp.clientHeight / 2;
    let best = 0;
    let bestDist = Infinity;
    
    items.forEach((el, idx) => {
      const c = el.offsetTop + el.offsetHeight / 2;
      const d = Math.abs(c - vpCenter);
      if (d < bestDist) {
        bestDist = d;
        best = idx;
      }
    });
    
    setActive(best);  // Set active = item gần center nhất
  }, 140);  // Debounce 140ms
};
```

**Cách hoạt động:**
- Khi user scroll bằng trackpad/touch, detect scroll event
- Debounce 140ms để chờ user dừng scroll
- Tìm item nào có center gần với viewport center nhất
- Set `active` = item đó → trigger snap animation

#### 4. **Smooth Animation với Easing**
```typescript
const animateScrollTo = (el: HTMLElement, to: number, duration = 200) => {
  const start = el.scrollTop;
  const change = to - start;
  const startTime = performance.now();
  
  const tick = (now: number) => {
    const elapsed = now - startTime;
    const t = Math.min(1, elapsed / duration);
    el.scrollTop = start + change * easeInOutQuad(t);  // Easing function
    if (t < 1) animRef.current = requestAnimationFrame(tick);
  };
  
  animRef.current = requestAnimationFrame(tick);
};

// Easing function: ease-in-out quadratic
function easeInOutQuad(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}
```

**Cách hoạt động:**
- Sử dụng `requestAnimationFrame` để animation mượt 60fps
- `easeInOutQuad` tạo chuyển động mượt mà (chậm ở đầu/cuối, nhanh ở giữa)
- Duration 450ms tạo cảm giác "cinematic"

#### 5. **Keyboard Navigation**
```typescript
const onKey = (e: KeyboardEvent) => {
  if (e.key === "ArrowDown") {
    e.preventDefault();
    setActive((p) => clamp(p + 1, 0, maxIdx));
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    setActive((p) => clamp(p - 1, 0, maxIdx));
  }
};
```

**Cách hoạt động:**
- Arrow Up/Down để navigate giữa các items
- Tương tự wheel event, thay đổi `active` → trigger snap

### Tổng kết flow:
1. **User input** (wheel/scroll/keyboard) → Thay đổi `active` state
2. **useEffect** detect `active` thay đổi → Gọi `snapToActive()`
3. **snapToActive()** tính toán vị trí → Gọi `animateScrollTo()`
4. **animateScrollTo()** sử dụng RAF + easing → Scroll mượt đến vị trí
5. **Visual feedback**: Item được highlight (active state) và nằm chính giữa viewport

### Điểm đặc biệt:
- **Multi-input support**: Hỗ trợ wheel, trackpad, touch, keyboard
- **Smooth animation**: RAF + easing function tạo chuyển động mượt
- **Debouncing**: Tránh spam events, chỉ snap khi user dừng scroll
- **Magnetic snap**: Tự động tìm item gần center nhất khi scroll tự do

---

## 3. Hiệu ứng hover của ảnh ở phần section đầu tiên (Hero section) được tạo ra như thế nào?

### Tổng quan
ProfileFrame component trong Hero section có nhiều hiệu ứng hover phức tạp:
1. **3D Tilt Effect** - Ảnh nghiêng theo con trỏ
2. **Dynamic Spotlight** - Ánh sáng di chuyển theo con trỏ
3. **Light Sweep** - Tia sáng quét qua khi hover
4. **Scale Effect** - Ảnh phóng to nhẹ khi hover

### Chi tiết từng hiệu ứng:

#### 1. **3D Tilt Effect** (Nghiêng ảnh theo con trỏ)
```typescript
const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

const onMove = (e: PointerEvent) => {
  const r = el.getBoundingClientRect();
  const px = ((e.clientX - r.left) / r.width) * 100;   // % từ trái
  const py = ((e.clientY - r.top) / r.height) * 100;   // % từ trên
  
  const dx = (px - 50) / 50;  // [-1..1] (trái = -1, phải = 1)
  const dy = (py - 50) / 50;  // [-1..1] (trên = -1, dưới = 1)
  
  // Tính góc nghiêng (clamp để không quá mạnh)
  const ry = clamp(dx * 4.5, -5, 5);   // Rotate Y: trái/phải
  const rx = clamp(-dy * 4.5, -5, 5); // Rotate X: trên/dưới (đảo dấu)
  
  // Throttle bằng RAF để performance tốt
  if (raf) cancelAnimationFrame(raf);
  raf = requestAnimationFrame(() => {
    setTilt({ rx, ry });
  });
};
```

**Cách hoạt động:**
- Track `pointermove` event để lấy vị trí con trỏ
- Convert vị trí pixel → phần trăm (0-100%)
- Tính toán góc nghiêng dựa trên khoảng cách từ center
- Áp dụng `perspective(900px) rotateX() rotateY()` CSS transform
- Throttle bằng `requestAnimationFrame` để mượt 60fps

**CSS:**
```typescript
style={{
  transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
  transition: "transform 180ms ease",
}}
```

#### 2. **Dynamic Spotlight** (Ánh sáng di chuyển theo con trỏ)
```typescript
const [spot, setSpot] = useState({ x: 50, y: 35 });

// Trong onMove:
setSpot({ x: px, y: py });  // Cập nhật vị trí spotlight

// Render:
<div
  style={{
    background: `radial-gradient(520px 520px at ${spot.x}% ${spot.y}%,
      rgba(74,210,255,0.22),      // Cyan ở center
      rgba(255,87,179,0.12) 35%,  // Magenta ở giữa
      transparent 62%)`,          // Trong suốt ở ngoài
  }}
/>
```

**Cách hoạt động:**
- Spotlight position (`spot.x`, `spot.y`) được update theo con trỏ
- Sử dụng `radial-gradient` với vị trí động
- Gradient có 3 màu: cyan (center) → magenta (giữa) → transparent (ngoài)
- Tạo hiệu ứng ánh sáng "theo dõi" con trỏ

#### 3. **Light Sweep** (Tia sáng quét qua khi hover)
```typescript
{/* Light sweep layer */}
<div className="pointer-events-none rotate-20 absolute inset-[-18%] opacity-0 group-hover:opacity-30 transition-opacity duration-300">
  <div
    className="absolute top-0 bottom-0 left-0 w-[55%] -translate-x-[70%] group-hover:translate-x-[190%] transition-transform duration-700 ease-out"
    style={{
      background: "linear-gradient(115deg, transparent 0%, rgba(255,255,255,0.22) 48%, transparent 100%)",
      filter: "blur(0.2px)",
      mixBlendMode: "overlay",
      maskImage: "linear-gradient(to right, transparent 0%, black 25%, black 75%, transparent 100%)",
    }}
  />
</div>
```

**Cách hoạt động:**
- **Initial state**: `opacity-0`, `translate-x-[-70%]` (ẩn, ở bên trái)
- **Hover state**: `group-hover:opacity-30`, `group-hover:translate-x-[190%]` (hiện, di chuyển sang phải)
- **Animation**: Transition 700ms với `ease-out` tạo chuyển động mượt
- **Gradient**: Linear gradient 115deg tạo tia sáng chéo
- **Mask**: Fade 2 đầu để không lộ mép thô
- **Blend mode**: `overlay` để tạo hiệu ứng ánh sáng tự nhiên

**Có 2 layer light sweep:**
1. **Base layer**: Áp dụng cho cả placeholder và image
2. **Image layer**: Chỉ hiện khi có image, nằm trên cùng (z-40)

#### 4. **Scale Effect** (Phóng to nhẹ khi hover)
```typescript
<img
  className="... group-hover:scale-[1.02] transition-transform duration-300"
/>
```

**Cách hoạt động:**
- Khi hover, ảnh scale từ 1.0 → 1.02 (2% lớn hơn)
- Transition 300ms tạo hiệu ứng mượt
- Tạo cảm giác "depth" và "interactive"

#### 5. **Focus Ring** (Vòng sáng quanh frame khi hover)
```typescript
<div className="... ring-1 ring-white/0 group-hover:ring-white/15 transition-all duration-300" />
```

**Cách hoạt động:**
- Ring mặc định: `ring-white/0` (trong suốt)
- Hover: `ring-white/15` (trắng 15% opacity)
- Transition 300ms tạo hiệu ứng fade in

#### 6. **Additional Effects**

**Film Grain:**
```typescript
<div
  style={{
    backgroundImage: "url('data:image/svg+xml,...')",  // SVG noise pattern
    backgroundSize: "320px 320px",
    opacity: 0.12,
    mixBlendMode: "overlay",
  }}
/>
```
- Tạo texture "film grain" để ảnh có cảm giác vintage/cinematic

**Vignette:**
```typescript
<div className="bg-gradient-to-b from-black/35 via-transparent to-black/35" />
```
- Gradient từ trên/dưới tạo hiệu ứng tối ở góc (vignette)

**Base Wash:**
```typescript
<div
  style={{
    background: "radial-gradient(circle at 20% 18%, rgba(54,120,255,0.14), transparent 55%)" +
                "radial-gradient(circle at 88% 80%, rgba(255,138,92,0.10), transparent 60%)",
  }}
/>
```
- 2 radial gradient cố định tạo ánh sáng nền (blue ở trên trái, orange ở dưới phải)

### Tổng kết flow hover:

1. **User hover vào frame** → `group-hover` classes được activate
2. **Pointer tracking** → `onMove` event update `tilt` và `spot` state
3. **3D Transform** → Frame nghiêng theo con trỏ với perspective
4. **Spotlight** → Radial gradient di chuyển theo con trỏ
5. **Light Sweep** → Tia sáng quét từ trái sang phải (700ms)
6. **Scale** → Ảnh phóng to nhẹ (1.02x)
7. **Focus Ring** → Vòng sáng xuất hiện quanh frame
8. **Visual layers** → Film grain, vignette, base wash tạo depth

### Điểm đặc biệt:
- **Performance**: Throttle bằng RAF, sử dụng CSS transforms (GPU-accelerated)
- **Layered effects**: Nhiều layer overlay tạo depth và cinematic feel
- **Responsive**: Tất cả effects đều responsive với con trỏ
- **Smooth transitions**: CSS transitions mượt mà, không bị giật

---

## Kết luận

Cả 3 features đều sử dụng:
- **React Hooks** (useState, useEffect, useRef) để quản lý state và side effects
- **Event listeners** để handle user interactions
- **Animation techniques** (RAF, CSS transitions, easing functions) để tạo chuyển động mượt
- **Performance optimizations** (throttling, debouncing, RAF) để đảm bảo smooth UX

