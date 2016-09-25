import { Meteor } from "meteor/meteor";
import { Random } from "meteor/random";
import { assert } from "meteor/practicalmeteor:chai";

import { Tasks } from "./tasks";

if ( Meteor.isServer ) {
	describe( "tasks", () => {
		describe( "methods", () => {
			const userId = Random.id();
			let taskId;

			beforeEach( () => {
				Tasks.remove( {} );

				taskId = Tasks.insert( {
					createdAt: new Date()
					, owner: userId
					, text: "test task"
					, username: "guest"
				} );

			} );

			it( "can delete an owned task", () => {
				const deleteTask = Meteor.server.method_handlers[ "tasks.remove" ];
				const invocation = { userId };

				deleteTask.call( invocation, taskId );

				assert.equal( Tasks.find().count(), 0 );
			} );
		} );
	} );
}
