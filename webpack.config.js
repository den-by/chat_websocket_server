const path = require('path');
const webpack = require('webpack');

const paths = {
    src: path.resolve(__dirname, 'src'),
    dist: path.resolve(__dirname, 'dist')
};

module.exports = {
    watch: true,
    devServer: {
        contentBase: path.join(__dirname, 'dist')
    },
    context: paths.src, // базовая директория для точек входа и загрузчиков
    entry: {
        app: './index'  // точка входа в приложение, наш src/index.ts файл, названием итогового бандла будет имя свойства - app
    },

    output: {
        path: paths.dist,  // путь для результатов сборки
        filename: 'server.js'  // название итогового бандла, получится dist/app.bundle.js
    },

    resolve: {
        extensions: [".wasm", ".mjs", ".js", ".jsx", ".ts", ".tsx", ".json"],
    },

    devtool: 'inline-source-map', // дополнительные настройки и загрузчики не требуются, хотя даже официальный рецепт от TypeScript рекомендует source-map-loader и поле в tsconfig - "sourceMap": true

    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'awesome-typescript-loader'
            } // загрузчик для обработки файлов с расширением .ts
        ]
    }
};