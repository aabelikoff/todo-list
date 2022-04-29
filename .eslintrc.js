module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:vue/essential"
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "vue"
    ],
    "rules": {
        "semi": ["error","always"],
        "quotes": ["error", "single"],
        "indent": ["warn", 2],
        "space-before-blocks": ["error", "always"],
        "keyword-spacing": ["error", {"after": true, "before": false, "overrides":{
            "else": {"before": true},
            "from": {"before": true},

        }}],
        "space-infix-ops": ["error", {"int32Hint": false}],
        "padded-blocks": ["error", "never"],
        "no-multiple-empty-lines": ["error", {"max":1, "maxEOF": 1}],
        "space-in-parens": ["error", "never"],
        "space-before-blocks": ["error", "always"],
        "array-bracket-spacing": ["error", "never"],
        "object-curly-spacing": ["error","always"],
        "max-len": ["error", {
            "code": 100, 
            "ignoreTrailingComments": true, 
            "ignoreComments": true,
            "ignoreStrings": true,
            "ignoreTemplateLiterals": true
        }],
        "block-spacing": ["error"],
        "computed-property-spacing": ["error","never"],
        "comma-spacing": ["error",{"before": false, "after": true}],
        "func-call-spacing": ["error","never"],
        "key-spacing": ["error",{"beforeColon": false, "afterColon": true, "mode": "strict"}],
        "no-trailing-spaces": ["error", {"skipBlankLines": true, "ignoreComments": true}],
    }
}
