import argparse
from langchain.chat_models import ChatOpenAI
from langchain.chains import GraphCypherQAChain
from langchain.graphs import Neo4jGraph
import os

os.environ['OPENAI_API_KEY'] = "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"

graph = Neo4jGraph(
    url="bolt://localhost:7687",
    username="neo4j",
    password="Pass@123"
)
chain = GraphCypherQAChain.from_llm(
    ChatOpenAI(temperature=0), graph=graph, verbose=True,
)

def run_query(comment):
    result = chain.run(comment)
    return result

def main():
    parser = argparse.ArgumentParser(description="Run a Neo4j query based on a comment.")
    parser.add_argument("comment", type=str, help="The comment/query to execute.")
    args = parser.parse_args()
    comment = args.comment
    result = run_query(comment)
    print(result)

if __name__ == "__main__":
    main()
