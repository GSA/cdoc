ruby '>= 3.1.3'

source "https://rubygems.org"

gem "jekyll", "~> 3.8" # pinned awaiting release of https://github.com/jekyll/jekyll/pull/9304
gem "execjs", "2.7.0" # https://github.com/rails/execjs/issues/99
gem "mini_racer"
gem "autoprefixer-rails"
gem "webrick" # not included in jekyll directly until 4.3.0 https://github.com/jekyll/jekyll/pull/8524

# See https://github.com/envygeeks/jekyll-assets/issues/622
gem "sprockets", "~> 3.7"
gem "kramdown-parser-gfm"

group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.15"
  gem 'jekyll-redirect-from'
  gem 'jekyll-paginate-v2', "3.0.0"  
  gem 'jekyll-sitemap'
  gem 'jekyll-seo-tag'
  gem 'jekyll-autoprefixer'
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem "tzinfo-data", platforms: [:mingw, :mswin, :x64_mingw, :jruby]

# Performance-booster for watching directories on Windows
gem "wdm", "~> 0.1.0" if Gem.win_platform?

gem "html-proofer", "~> 3.15"
