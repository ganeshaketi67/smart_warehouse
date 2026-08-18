import streamlit as st
import pandas as pd
from datetime import datetime

st.set_page_config(
    page_title="Smart Warehouse Operations",
    page_icon="📦",
    layout="wide",
)

# -----------------------------
# Demo data
# -----------------------------
if "inventory" not in st.session_state:
    st.session_state.inventory = pd.DataFrame([
        {"SKU": "SKU-1001", "Product": "Wireless Scanner", "Category": "Electronics", "Stock": 145, "Reorder": 50, "Location": "A-01"},
        {"SKU": "SKU-1002", "Product": "Barcode Labels", "Category": "Supplies", "Stock": 38, "Reorder": 60, "Location": "B-04"},
        {"SKU": "SKU-1003", "Product": "Packing Tape", "Category": "Packaging", "Stock": 210, "Reorder": 75, "Location": "C-02"},
        {"SKU": "SKU-1004", "Product": "Safety Gloves", "Category": "Safety", "Stock": 24, "Reorder": 40, "Location": "D-03"},
        {"SKU": "SKU-1005", "Product": "Shipping Box M", "Category": "Packaging", "Stock": 95, "Reorder": 80, "Location": "C-05"},
    ])

if "orders" not in st.session_state:
    st.session_state.orders = pd.DataFrame([
        {"Order": "ORD-5001", "Customer": "Customer A", "Priority": "High", "SKU": "SKU-1001", "Required": 30, "Allocated": 30, "Status": "Ready"},
        {"Order": "ORD-5002", "Customer": "Customer B", "Priority": "Critical", "SKU": "SKU-1002", "Required": 70, "Allocated": 38, "Status": "Shortage"},
        {"Order": "ORD-5003", "Customer": "Customer C", "Priority": "Medium", "SKU": "SKU-1003", "Required": 50, "Allocated": 50, "Status": "Picking"},
        {"Order": "ORD-5004", "Customer": "Customer D", "Priority": "Low", "SKU": "SKU-1005", "Required": 20, "Allocated": 20, "Status": "Ready"},
    ])

# -----------------------------
# Header
# -----------------------------
st.title("📦 Smart Warehouse Operations")
st.caption("Inventory visibility • Order fulfillment • Exception review • What-if simulation")

# -----------------------------
# Sidebar
# -----------------------------
with st.sidebar:
    st.header("Navigation")
    page = st.radio(
        "Go to",
        [
            "Command Center",
            "Inventory",
            "Orders",
            "Exception Review",
            "What-If Simulator",
            "Analytics",
        ],
    )

    st.divider()
    st.info("Demo mode: data is stored in the current Streamlit session.")

# -----------------------------
# Helper
# -----------------------------
def priority_score(priority: str) -> int:
    return {"Critical": 4, "High": 3, "Medium": 2, "Low": 1}.get(priority, 0)


# -----------------------------
# Command Center
# -----------------------------
if page == "Command Center":
    inventory = st.session_state.inventory
    orders = st.session_state.orders

    low_stock = int((inventory["Stock"] < inventory["Reorder"]).sum())
    shortage_orders = int((orders["Required"] > orders["Allocated"]).sum())
    ready_orders = int((orders["Status"] == "Ready").sum())
    fulfillment_rate = round(
        orders["Allocated"].sum() / max(orders["Required"].sum(), 1) * 100, 1
    )

    c1, c2, c3, c4 = st.columns(4)
    c1.metric("📦 SKUs", len(inventory))
    c2.metric("⚠️ Low Stock", low_stock)
    c3.metric("🚨 Exceptions", shortage_orders)
    c4.metric("✅ Allocation Rate", f"{fulfillment_rate}%")

    st.subheader("Priority Order Queue")

    queue = orders.copy()
    queue["Score"] = queue["Priority"].map(priority_score)
    queue = queue.sort_values("Score", ascending=False).drop(columns=["Score"])

    st.dataframe(queue, use_container_width=True, hide_index=True)

    st.subheader("Warehouse Health")

    h1, h2 = st.columns(2)
    with h1:
        st.progress(min(fulfillment_rate / 100, 1.0), text=f"Fulfillment: {fulfillment_rate}%")
    with h2:
        if shortage_orders:
            st.warning(f"{shortage_orders} order(s) require exception review.")
        else:
            st.success("No fulfillment exceptions.")

# -----------------------------
# Inventory
# -----------------------------
elif page == "Inventory":
    st.header("Inventory Management")

    inventory = st.session_state.inventory.copy()

    search = st.text_input("🔎 Search SKU or product")
    category = st.selectbox(
        "Category",
        ["All"] + sorted(inventory["Category"].unique().tolist()),
    )

    if search:
        mask = (
            inventory["SKU"].str.contains(search, case=False, na=False)
            | inventory["Product"].str.contains(search, case=False, na=False)
        )
        inventory = inventory[mask]

    if category != "All":
        inventory = inventory[inventory["Category"] == category]

    inventory["Risk"] = inventory.apply(
        lambda row: "LOW STOCK" if row["Stock"] < row["Reorder"] else "Healthy",
        axis=1,
    )

    st.dataframe(inventory, use_container_width=True, hide_index=True)

    low_items = inventory[inventory["Stock"] < inventory["Reorder"]]
    if not low_items.empty:
        st.warning(f"{len(low_items)} inventory item(s) are below reorder level.")

# -----------------------------
# Orders
# -----------------------------
elif page == "Orders":
    st.header("Order Fulfillment")

    orders = st.session_state.orders.copy()

    status = st.selectbox(
        "Status",
        ["All"] + sorted(orders["Status"].unique().tolist()),
    )

    if status != "All":
        orders = orders[orders["Status"] == status]

    st.dataframe(orders, use_container_width=True, hide_index=True)

    st.subheader("Update Order Status")

    order_id = st.selectbox(
        "Order",
        st.session_state.orders["Order"].tolist(),
    )
    new_status = st.selectbox(
        "New status",
        ["Ready", "Picking", "Packed", "Dispatched", "Shortage", "Cancelled"],
    )

    if st.button("Update Order"):
        idx = st.session_state.orders.index[
            st.session_state.orders["Order"] == order_id
        ][0]
        st.session_state.orders.loc[idx, "Status"] = new_status
        st.success(f"{order_id} updated to {new_status}.")
        st.rerun()

# -----------------------------
# Exception Review
# -----------------------------
elif page == "Exception Review":
    st.header("🚨 Exception Review")

    orders = st.session_state.orders
    exceptions = orders[orders["Required"] > orders["Allocated"]].copy()

    if exceptions.empty:
        st.success("No open fulfillment exceptions.")
    else:
        st.warning(f"{len(exceptions)} exception(s) need attention.")

        for _, row in exceptions.iterrows():
            shortage = int(row["Required"] - row["Allocated"])

            with st.expander(f"{row['Order']} — {row['Priority']} priority"):
                st.write(f"**Customer:** {row['Customer']}")
                st.write(f"**SKU:** {row['SKU']}")
                st.write(f"**Required:** {row['Required']}")
                st.write(f"**Allocated:** {row['Allocated']}")
                st.write(f"**Shortage:** {shortage}")

                st.info(
                    "Recommended action: review available inventory, "
                    "alternative stock locations, or replenishment options."
                )

# -----------------------------
# What-if Simulator
# -----------------------------
elif page == "What-If Simulator":
    st.header("🧪 What-If Allocation Simulator")
    st.caption("Sandbox mode — changes here do not modify live inventory.")

    left, right = st.columns(2)

    with left:
        available_stock = st.number_input(
            "Available stock",
            min_value=0,
            value=100,
            step=1,
        )
        order_demand = st.number_input(
            "Order demand",
            min_value=0,
            value=80,
            step=1,
        )

    with right:
        priority = st.select_slider(
            "Order priority",
            options=["Low", "Medium", "High", "Critical"],
            value="High",
        )

    allocation = min(available_stock, order_demand)
    shortage = max(order_demand - available_stock, 0)

    s1, s2, s3 = st.columns(3)
    s1.metric("Allocation", allocation)
    s2.metric("Shortage", shortage)
    s3.metric("Priority", priority)

    if shortage == 0:
        st.success("Scenario can be fully allocated.")
    else:
        st.warning("Scenario has a stock shortage.")

    st.write("### Decision rationale")
    if shortage:
        st.write(
            f"The order requires {order_demand} units but only "
            f"{available_stock} are available. Allocate {allocation} units "
            f"and review {shortage} units through the exception workflow."
        )
    else:
        st.write(
            f"Available stock is sufficient to allocate all {order_demand} units."
        )

# -----------------------------
# Analytics
# -----------------------------
elif page == "Analytics":
    st.header("📊 Warehouse Analytics")

    orders = st.session_state.orders

    total_required = int(orders["Required"].sum())
    total_allocated = int(orders["Allocated"].sum())
    total_shortage = total_required - total_allocated

    a1, a2, a3 = st.columns(3)
    a1.metric("Total Demand", total_required)
    a2.metric("Allocated", total_allocated)
    a3.metric("Shortage", total_shortage)

    chart_data = orders.set_index("Order")[["Required", "Allocated"]]
    st.bar_chart(chart_data)

    st.subheader("Order Status Distribution")
    status_counts = orders["Status"].value_counts()
    st.bar_chart(status_counts)

# -----------------------------
# Footer
# -----------------------------
st.divider()
st.caption(
    f"Smart Warehouse Operations • Session started/updated {datetime.now().strftime('%Y-%m-%d %H:%M')}"
)
