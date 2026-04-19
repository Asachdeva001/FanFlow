/* BigQuery Analytical SQL for Looker Studio Dashboards */

/* 
 * 1. Identify Congestion Bottlenecks (Heatmap Simulator)
 * Clusters anonymous coordinates into 0.0005 deg boundary bins.
 */
SELECT 
    ST_SNAPTOGRID(ST_GEOGPOINT(longitude, latitude), 0.0005) AS grid_cell,
    COUNT(DISTINCT hashed_user_id) AS density_count
FROM 
    `{PROJECT_ID}.venue_analytics.telemetry_log`
WHERE 
    timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 5 MINUTE)
GROUP BY 
    grid_cell
ORDER BY 
    density_count DESC;


/* 
 * 2. Predict Concession Wait Times and Bottleneck Surges
 * Detects impending swarms toward food stations.
 */
SELECT 
    is_food_run,
    COUNT(DISTINCT hashed_user_id) AS fans_approaching
FROM 
    `{PROJECT_ID}.venue_analytics.telemetry_log`
WHERE 
    is_food_run = TRUE
    AND timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 10 MINUTE)
GROUP BY 
    is_food_run;
