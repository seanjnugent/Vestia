 SELECT b.account_id,
    COALESCE(sum(a.amount), (0)::numeric) AS total_cash_balance,
    a.currency_code
   FROM (cash_trade a
     RIGHT JOIN account b ON ((a.account_id = b.account_id)))
  WHERE ((a.cash_trade_status)::text = 'Completed'::text)
  GROUP BY b.account_id, a.currency_code;;
