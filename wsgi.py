from server.main import app

if __name__ == "__main__":
    app.run('0.0.0.0', exclude_patterns=('**/*.zip'))