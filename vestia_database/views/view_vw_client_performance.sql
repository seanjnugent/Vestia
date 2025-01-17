 WITH account_performance AS (
         SELECT a.client_id,
            sum(b.total_cost_basis) AS total_cost_basis,
            sum(b.asset_value) AS total_asset_value,
            sum(b.net_performance) AS total_net_performance
           FROM (account a
             JOIN vw_asset_balance b ON ((a.account_id = b.account_id)))
          GROUP BY a.client_id
        )
 SELECT c.client_id,
    c.first_name,
    c.surname,
    ap.total_cost_basis,
    ap.total_asset_value,
    ap.total_net_performance,
        CASE
            WHEN (ap.total_cost_basis > (0)::numeric) THEN ((ap.total_net_performance / ap.total_cost_basis) * (100)::numeric)
            ELSE (0)::numeric
        END AS total_return_percentage
   FROM (account_performance ap
     JOIN client c ON ((ap.client_id = c.client_id)));;
