 SELECT a.asset_id,
    a.asset_code,
    p.currency_code,
    p.amount AS latest_price,
    p.price_date
   FROM (asset_price p
     JOIN asset a ON ((p.asset_id = a.asset_id)))
  WHERE ((p.asset_id, p.price_date) IN ( SELECT asset_price.asset_id,
            max(asset_price.price_date) AS max
           FROM asset_price
          GROUP BY asset_price.asset_id));;
