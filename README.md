# tsbridge

Web UI for Options Trading Monitor (option_monitor.py) signals and orders.

## Features
- Realtime display of signals and orders
- Updates automatically (polling)
- Sound alert on every new order
- Read-only UI (no inputs)

## Setup Neon DB
1. Go to [neon.tech](https://neon.tech) and create a free project.
2. Open SQL Editor and run the contents of `schema.sql`.
3. Copy the connection string (postgresql://...).
4. In Vercel project settings > Environment Variables, add `DATABASE_URL` with that string (for Production, Preview, Development).

## Deploy to Vercel
1. Link this GitHub repo to a Vercel project named `tsbridge`.
2. Set the `DATABASE_URL` env var.
3. Deploy. The app will be at `https://tsbridge-xxx.vercel.app`.

## Connecting from option_monitor.py
In your Python script, after placing an order or detecting a signal, POST to:
- `https://YOUR-VERCEL-URL/api/signal` for signals
- `https://YOUR-VERCEL-URL/api/order` for orders

Example (add to place_order or after BUY/SELL):
```python
import requests
WEB_URL = "https://your-app.vercel.app"
def notify_web(endpoint, data):
    try:
        requests.post(f"{WEB_URL}{endpoint}", json=data, timeout=2)
    except:
        pass
# on signal:
notify_web("/api/signal", {"symbol": symName, "side": side, "k_type": k_type, "date": datee, "time": timee, "price": price})
# on order:
notify_web("/api/order", {"symbol": opt, "action": "BUY", "price": ltp, "time": btime, "order_id": str(oid)})
```

The UI polls every 2 seconds and plays a beep on new orders.
