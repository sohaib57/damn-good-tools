/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {},
    webpack: (config) => {
        config.externals = [...config.externals, "canvas", "hnswlib-node"]
        config.experiments = {
            asyncWebAssembly: true,
            layers: true,
        }

        return config
    },
}

export default nextConfig
