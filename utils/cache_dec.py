from django.core.cache import caches


def cache_check(**cache_kwargs):
    def _cache_check(func):
        def wrapper(self, request, *args, **kwargs):
            CACHES = caches['default']
            if 'cache' in cache_kwargs:
                CACHES = caches[cache_kwargs['cache']]

            cache_key = cache_kwargs['key_pre'] + str(kwargs['sku_id'])
            json_resp = CACHES.get(cache_key)
            if json_resp:
                print('******從緩存中獲取數據成功******')
                return json_resp

            # 如果沒有數據 將數據保存
            resp = func(self, request, *args, **kwargs)
            expire = cache_kwargs.get('expire', 300)
            CACHES.set(cache_key, resp, expire)
            return resp

        return wrapper

    return _cache_check
