# Event Registration API Integration

Use this public endpoint when another application needs to register attendees for an event.

## Endpoint

```http
POST {API_BASE_URL}/api/v1/attendance/qr/{eventQrCode}/register
```

Example:

```http
POST https://uat-api-mems.moc.gov.kh/api/v1/attendance/qr/RGQ-oQpHQf_2kQcJp9pFos9_/register
```

This endpoint is public. No admin bearer token is required. The QR code in the URL authorizes registration for that event or place QR.

## Request Body

| Field             | Type   | Required                    | Notes                                                                                          |
| ----------------- | ------ | --------------------------- | ---------------------------------------------------------------------------------------------- |
| `fullNameKm`      | string | Yes                         | Attendee full name in Khmer.                                                                   |
| `fullNameEn`      | string | Yes                         | Attendee full name in English.                                                                 |
| `gender`          | string | No                          | One of `MALE`, `FEMALE`, `OTHER`.                                                              |
| `title`           | string | No                          | Honorific or title, for example `Mr.`, `Ms.`, `Dr.`.                                           |
| `position`        | string | Yes                         | Job title or role.                                                                             |
| `organization`    | string | Yes                         | Ministry, company, department, or group.                                                       |
| `phoneNumber`     | string | Yes                         | Contact phone number.                                                                          |
| `email`           | string | Required for email delivery | Used when `deliveryMethod` is `email`.                                                         |
| `deliveryMethod`  | string | No                          | One of `download`, `telegram`, `email`. Default is `download`.                                 |
| `profileImageUrl` | string | No                          | Public image URL for attendee profile if available.                                            |
| `latitude`        | number | Sometimes                   | Required only when registering also confirms attendance and the event/place requires location. |
| `longitude`       | number | Sometimes                   | Required only when registering also confirms attendance and the event/place requires location. |

Do not send `shiftId`. The API automatically matches the active shift when registration happens during an event shift.

Do not send QR code or place ID in the body. The QR code is already in the endpoint URL. Place is resolved from the QR code.

## Example Request

```json
{
  "fullNameKm": "សុខ ដារ៉ា",
  "fullNameEn": "Sok Dara",
  "gender": "MALE",
  "title": "Mr.",
  "position": "Program Officer",
  "organization": "Ministry of Commerce",
  "phoneNumber": "+85512345678",
  "email": "sok.dara@example.com",
  "deliveryMethod": "download",
  "profileImageUrl": "https://example.com/profile.jpg"
}
```

With location:

```json
{
  "fullNameKm": "សុខ ដារ៉ា",
  "fullNameEn": "Sok Dara",
  "gender": "MALE",
  "title": "Mr.",
  "position": "Program Officer",
  "organization": "Ministry of Commerce",
  "phoneNumber": "+85512345678",
  "deliveryMethod": "download",
  "profileImageUrl": "https://example.com/profile.jpg",
  "latitude": 11.5564,
  "longitude": 104.9282
}
```

## Response Examples

### Download

```json
{
  "success": true,
  "data": {
    "id": "cms2t0j3m000h01rtci5f4752",
    "eventId": "cms2piy7s000301rtizc6jl2t",
    "placeId": "cms2piy8e000401rtp2ncjy3b",
    "fullNameEn": "Sok Dara",
    "fullNameKm": "សុខ ដារ៉ា",
    "gender": "MALE",
    "title": "Mr.",
    "position": "Program Officer",
    "organization": "Ministry of Commerce",
    "phoneNumber": "+85512345678",
    "email": "sok.dara@example.com",
    "profileImageUrl": "https://example.com/profile.jpg",
    "checkInCode": "iRH3y0px0UqEcJaEUQvqqTO0",
    "qrDeliveryMethod": "download",
    "qrDeliveryStatus": "sent",
    "qrImage": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "delivery": {
      "method": "download",
      "attended": false,
      "telegramUrl": null,
      "emailSent": false
    }
  }
}
```

### Telegram

```json
{
  "success": true,
  "data": {
    "id": "cms2t0j3m000h01rtci5f4752",
    "eventId": "cms2piy7s000301rtizc6jl2t",
    "placeId": "cms2piy8e000401rtp2ncjy3b",
    "fullNameEn": "Sok Dara",
    "fullNameKm": "ážŸáž»áž ážŠáž¶ážšáŸ‰áž¶",
    "gender": "MALE",
    "title": "Mr.",
    "position": "Program Officer",
    "organization": "Ministry of Commerce",
    "phoneNumber": "+85512345678",
    "email": "sok.dara@example.com",
    "profileImageUrl": "https://example.com/profile.jpg",
    "checkInCode": "iRH3y0px0UqEcJaEUQvqqTO0",
    "qrDeliveryMethod": "telegram",
    "qrDeliveryStatus": "pending",
    "qrImage": null,
    "delivery": {
      "method": "telegram",
      "attended": false,
      "telegramUrl": "https://t.me/moc_attendance_bot?start=iRH3y0px0UqEcJaEUQvqqTO0",
      "emailSent": false
    }
  }
}
```

### Email

```json
{
  "success": true,
  "data": {
    "id": "cms2t0j3m000h01rtci5f4752",
    "eventId": "cms2piy7s000301rtizc6jl2t",
    "placeId": "cms2piy8e000401rtp2ncjy3b",
    "fullNameEn": "Sok Dara",
    "fullNameKm": "ážŸáž»áž ážŠáž¶ážšáŸ‰áž¶",
    "gender": "MALE",
    "title": "Mr.",
    "position": "Program Officer",
    "organization": "Ministry of Commerce",
    "phoneNumber": "+85512345678",
    "email": "sok.dara@example.com",
    "profileImageUrl": "https://example.com/profile.jpg",
    "checkInCode": "iRH3y0px0UqEcJaEUQvqqTO0",
    "qrDeliveryMethod": "email",
    "qrDeliveryStatus": "sent",
    "qrImage": null,
    "delivery": {
      "method": "email",
      "attended": false,
      "telegramUrl": null,
      "emailSent": true
    }
  }
}
```

`qrImage` is a Base64 PNG data URL. It is a ready-to-display branded QR image with blue QR modules and the MoC logo in the center.

Use it directly:

```html
<img
  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
  alt="Attendee QR"
/>
```

If another application wants to design its own QR style, use `checkInCode` as the raw QR value.

## Delivery Behavior

| Method     | Behavior                                                                              |
| ---------- | ------------------------------------------------------------------------------------- |
| `download` | API returns `qrImage`; the client can show or download it.                            |
| `telegram` | API returns `delivery.telegramUrl`; open it to link the attendee to the Telegram bot. |
| `email`    | API emails the QR image to the attendee. `email` is required.                         |

## Registration And Attendance Rules

- Before event start: registration is allowed, but attendance is not confirmed.
- On event date with no shifts: location is required only if the event/place requires location; successful registration also confirms attendance.
- During an active shift: location is required only if the event/place requires location; successful registration also confirms attendance for that shift.
- Outside active shift: pre-registration is allowed, but attendance is not confirmed.
- After event end: registration is rejected.

## Error Examples

Location required:

```json
{
  "success": false,
  "error": {
    "code": "LOCATION_REQUIRED",
    "message": "Please allow location access. Attendance can only be confirmed when you are at the event venue."
  }
}
```

Duplicate registration:

```json
{
  "success": false,
  "error": {
    "code": "DUPLICATE_REGISTRATION",
    "message": "An attendee with the same full name or phone number is already registered."
  }
}
```
