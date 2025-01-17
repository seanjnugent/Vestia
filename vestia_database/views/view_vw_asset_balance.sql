 WITH cte_trades AS (
         SELECT asset_trade.asset_trade_type,
            asset_trade.asset_trade_quantity,
            asset_trade.asset_trade_unit_cost,
            asset_trade.account_id,
            asset_trade.asset_id,
            asset_trade.date_completed
           FROM asset_trade
        ), performance_analysis AS (
         SELECT cte_trades.asset_id,
            cte_trades.account_id,
            sum(cte_trades.asset_trade_quantity) AS remaining_units,
            sum(
                CASE
                    WHEN ((cte_trades.asset_trade_type)::text = 'Buy'::text) THEN (cte_trades.asset_trade_quantity * cte_trades.asset_trade_unit_cost)
                    ELSE (0)::numeric
                END) AS total_buy_cost,
            sum(
                CASE
                    WHEN ((cte_trades.asset_trade_type)::text = 'Sell'::text) THEN ((- cte_trades.asset_trade_quantity) * cte_trades.asset_trade_unit_cost)
                    ELSE (0)::numeric
                END) AS total_sell_proceeds
           FROM cte_trades
          GROUP BY cte_trades.asset_id, cte_trades.account_id
        )
 SELECT a.account_id,
    a.asset_id,
    a.remaining_units AS asset_holding,
    (a.remaining_units * b.latest_price) AS asset_value,
    a.total_buy_cost AS total_cost_basis,
    a.total_buy_cost,
    a.total_sell_proceeds,
    (a.total_sell_proceeds - a.total_buy_cost) AS net_cash_flow,
        CASE
            WHEN (a.remaining_units > (0)::numeric) THEN (a.total_buy_cost / a.remaining_units)
            ELSE (0)::numeric
        END AS average_unit_cost,
    (((a.remaining_units * b.latest_price) + a.total_sell_proceeds) - a.total_buy_cost) AS net_performance,
        CASE
            WHEN (a.total_buy_cost > (0)::numeric) THEN (((((a.remaining_units * b.latest_price) + a.total_sell_proceeds) - a.total_buy_cost) / a.total_buy_cost) * (100)::numeric)
            ELSE (0)::numeric
        END AS total_return_percentage
   FROM (performance_analysis a
     JOIN vw_latest_price b ON ((a.asset_id = b.asset_id)));;
