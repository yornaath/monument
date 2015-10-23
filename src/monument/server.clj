(ns monument.server
  (:require [com.stuartsierra.component :as component]
            [aleph.http :as http]
            [compojure.core :refer [GET POST defroutes]]
            [compojure.handler :refer [site]]
            [compojure.route :as route]
            [ring.util.response :as response]
            [ring.middleware.reload :as reload]
            [ring.util.codec :refer [form-encode]]
            [monument.middleware :as middleware]
            [monger.collection :as mc]
            [hiccup.core :refer [html]]
            [monument.template.layout :as layout-template]
            [monument.template.podcasts :as podcasts-template]
            [monument.template.events :as events-template]
            [monument.template.page :as page-template]
            [monger.conversion :refer [from-db-object]]))


(defn index-handler [req]
  (let [podcasts (mc/find-maps (:db req) "podcast")
        pages (mc/find-maps (:db req) "page")]
    {:status 200
     :body   (layout-template/render
               {:active-page "podcasts"
                :pages pages
                :body  (podcasts-template/render {:podcasts podcasts})})}))


(defn page-handler [req]
  (let [page-name (:page (:params req))
        pages (mc/find-maps (:db req) "page")
        page (mc/find-one-as-map (:db req) "page" {:name page-name})]
    {:status 200
     :body   (layout-template/render
               {:active-page page-name
                :pages pages
                :body  (page-template/render {:page page})})}))


(defn events-handler [req]
  (let [pages (mc/find-maps (:db req) "page")
        formdata (get-in req [:params])]
    (println formdata)
    {:status 200
     :body   (layout-template/render
               {:active-page "events"
                :pages pages
                :body  (events-template/render
                         {:formdata formdata})})}))


(defn subscribe-handler [req]
  (let [pages (mc/find-maps (:db req) "page")
        formdata (:params req)]
    (response/redirect (str "/events?" (form-encode formdata)))))


(defroutes all-routes
           (route/resources "/")
           (GET "/" [] index-handler)
           (GET "/events" [] events-handler)
           (POST "/subscribe" [] subscribe-handler)
           (GET "/static/:page" [] page-handler)
           (route/not-found "<h1>Page not found</h1>"))


(defn app [db]
  (-> (site #'all-routes)
      (reload/wrap-reload)
      (middleware/provide {:db db})))


(defn create-server-handler [port db]
  (http/start-server (app db) {:port port}))


(defrecord Server [port]
  component/Lifecycle
  (start [component]
    (let [server (create-server-handler port (:db (:database component)))]
      (assoc component :server server)))
  (stop [component]
    (let [server (:server component)]
      (.close server))))


(defn create-server [port]
  (map->Server {:port port}))