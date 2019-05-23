<template>
    <div id="app">
        <a-locale-provider :locale="zh_CN">
            <router-view />
        </a-locale-provider>
    </div>
</template>

<script>
    import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN';
    export default {
        name: "App",
        data() {
            return {
                zh_CN,
            }
        }
    };
</script>

<style>
    #app {
        width: 100%;
        height: 100%;
        color: #333;
    }

    ul,
    li {
        list-style: none;
        padding: 0;
        margin: 0;
    }
</style>