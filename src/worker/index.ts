import { Hono } from "hono";

type Bindings = {
  TOUCH_KV: KVNamespace;
  API_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/api/", (c) => {
  return c.json({
    message: "ESP32 API aktif",
  });
});

app.post("/api/touch", async (c) => {
  const apiKey = c.req.header("X-API-Key");

  if (apiKey !== c.env.API_KEY) {
    return c.json(
      {
        success: false,
        message: "Unauthorized",
      },
      401
    );
  }

  const body = await c.req.json();

  const data = {
    device: body.device ?? "esp32-s3",
    event: body.event ?? "touch",
    gpio: body.gpio ?? null,
    touchValue: body.touchValue ?? null,
    createdAt: new Date().toISOString(),
  };

  await c.env.TOUCH_KV.put("latest_touch", JSON.stringify(data));

  return c.json({
    success: true,
    data,
  });
});

app.get("/api/touch/latest", async (c) => {
  const latest = await c.env.TOUCH_KV.get("latest_touch");

  if (!latest) {
    return c.json({
      success: false,
      message: "Belum ada data dari ESP32",
    });
  }

  return c.json({
    success: true,
    data: JSON.parse(latest),
  });
});

export default app;
