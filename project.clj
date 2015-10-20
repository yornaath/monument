(defproject monument "0.1.0-SNAPSHOT"

  :description "FIXME: write description"

  :url "http://example.com/FIXME"

  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}

  :dependencies [[org.clojure/clojure "1.7.0"]
                 [org.clojure/clojurescript "1.7.145"]
                 [org.clojure/core.async "0.1.346.0-17112a-alpha"]
                 [com.stuartsierra/component "0.3.0"]
                 [aleph "0.4.0"]
                 [compojure "1.4.0"]
                 [ring/ring-devel "1.4.0"]
                 [ring/ring-core "1.4.0"]
                 [reloaded.repl "0.1.0"]
                 [environ "1.0.1"]
                 [hiccup "1.0.5"]
                 [markdown-clj "0.9.75"]
                 [com.novemberain/monger "3.0.0-rc2"]
                 [javax.servlet/servlet-api "2.5"]]

  :main ^:skip-aot monument.core

  :target-path "target/%s"

  :plugins [[lein-less "1.7.5"]
            [lein-cljsbuild "1.1.0"]]

  :less {:source-paths ["src/monument/less/indexfiles"]
         :target-path "resources/public/css"}

  :cljsbuild {:builds [{:source-paths ["src-cljs/monument/pages/podcasts"]
                        :compiler {:output-to "resources/public/js/podcasts-page.js"
                                   :output-dir "resources/public/js/out"
                                   :main "monument.pages.podcasts.core"
                                   :optimizations :none
                                   :asset-path "/js/out"
                                   :recompile-dependents true}}]}

  :profiles {:uberjar {:aot :all}
             :dev {:plugins []
                   :main user
                   :source-paths ["dev"]}})
